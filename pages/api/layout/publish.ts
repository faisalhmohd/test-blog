import connectToDatabase from "../../../server/utils/db"
import Layout from "../../../server/models/layout"

const isProduction = process.env.NODE_ENV === 'production';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const payload = req.body;

    try {
      if (payload.event_name === 'asset_published') {
        console.log('asset_published event received');

        const data = payload.data.assets.structured_contents[0].content_body;
        const instance_guid = payload.data.organization.id;
        const fields = data.latest_fields_version.fields;
        const mainCTA = fields.mainCTA[0].field_values[0].content_details.latest_fields_version.fields;
        const mission = fields.missionSection[0].field_values[0].content_details.latest_fields_version.fields;
        const vision = fields.visionSection[0].field_values[0].content_details.latest_fields_version.fields;
        const products = fields.productsSection[0].field_values[0].content_details.latest_fields_version.fields;
        const contactUs = fields.contactUsSection[0].field_values[0].content_details.latest_fields_version.fields;
        const joinUs = fields.joinUsSection[0].field_values[0].content_details.latest_fields_version.fields;

        const layoutData = {
          mainCTA: {
            title: mainCTA.title[0].field_values[0].text_value,
            description: mainCTA.description[0].field_values[0].rich_text_value,
            ctaText: mainCTA.cTAText[0].field_values[0].text_value,
          },
          mission: {
            title: mission.title[0].field_values[0].text_value,
            description: mission.description[0].field_values[0].rich_text_value,
            video: mission.videoURL[0].field_values[0].data,
          },
          vision: {
            ctas: vision.cTAs[0].field_values.map(value => {
              const field = value.content_details.latest_fields_version.fields;

              return {
                title: field.title[0].field_values[0].text_value,
                description: field.description[0].field_values[0].rich_text_value,
                backgroundImage: 'test',
              }
            })
          },
          products: {
            title: products.title[0].field_values[0].text_value,
            description: products.description[0].field_values[0].rich_text_value,
            slider: products.slider[0].field_values.map(value => {
              const field = value.content_details.latest_fields_version.fields;

              return {
                title: field.title[0].field_values[0].text_value,
                description: field.description[0].field_values[0].rich_text_value,
                backgroundImage: 'test',
              }
            })
          },
          contactUs: {
            title: contactUs.title[0].field_values[0].text_value,
            description: contactUs.description[0].field_values[0].rich_text_value,
            location: {
              latitude: contactUs.location[0].field_values[0].latitude,
              longitude: contactUs.location[0].field_values[0].longitude,
            },
            addressText: contactUs.addressText[0].field_values[0].rich_text_value,
          },
          joinUs: {
            title: joinUs.title[0].field_values[0].text_value,
            ctaText: joinUs.cTAText[0].field_values[0].text_value,
          },
        };

        const { token_type, access_token } = await fetch(isProduction ? 'https://accounts.newscred.com/o/oauth2/v1/token' : 'http://host.docker.internal:4001/o/oauth2/v1/token', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: isProduction ? JSON.stringify({
            "client_id": "b944a602-18a4-42c4-81d8-160733501019",
            "client_secret": "80455869e18678e63045bde943873b44036e3425c910a4dbd3e551534963824f",
            "grant_type": "client_credentials"
          }) : JSON.stringify({
            "client_id": "e7b6981c-d667-4191-b9bd-43f10d68d398",
            "client_secret": "e078fce220e8e9c956c431f86c089359db88c17abc38329d47cb8b8dd627556d",
            "grant_type": "client_credentials"
          })
        }).then(res => res.json());
        console.log('Token generated for publishing_event');

        await connectToDatabase();
        const layout = new Layout(layoutData);
        const newLayout = await layout.save();

        console.log(`Created Layout - ${newLayout._id}`);

        const links = payload.data.publishing_event.links;
        const publishingMetadataLink = isProduction ? links.publishing_metadata : `http://host.docker.internal:5010/public-api/v3/organizations/${instance_guid}/publishing-events/${links.publishing_metadata.split('/v3/publishing-events/')[1]}`

        const publishingMetadataResponse = await fetch(publishingMetadataLink, {
          method: 'patch',
          body: JSON.stringify({
            status: 'published',
            status_message: 'Successfully published to Test Layout',
            publishing_destination_updated_at: (new Date()).toISOString(),
            public_url: `https://test-blog-sepia.vercel.app/layout/${newLayout._id}`
          }),
          headers: {
            'Authorization': `${token_type} ${access_token}`,
            'Content-Type': 'application/json',
            'X-USER-SSO-ID': isProduction ? '595a042af8d1c2736bdc55ec' : '59742fc12a64853537b08036'
          }
        });

        if (publishingMetadataResponse.status !== 200) {
          const error = await publishingMetadataResponse.json();
          console.log({ message: 'Could not trigger publishing meta data', error: JSON.stringify(error) });
          res.status(500).json({ message: 'Could not trigger publishing meta data', error: JSON.stringify(error) });
          return;
        }
        console.log(`${publishingMetadataLink} completed`, {
          status: 'published',
          status_message: 'Successfully published to Test Layout',
          publishing_destination_updated_at: (new Date()).toISOString(),
          public_url: `https://test-blog-sepia.vercel.app/layout/${newLayout._id}`
        });

        res.status(200).json({ 'message': 'Done!' });
      }
      else {
        res.status(200).json({ 'message': 'Ignored' })
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 'Invalid Payload', err });
    }

  } else {
    res.status(200).json({ name: 'John Doe' })
  }
}
