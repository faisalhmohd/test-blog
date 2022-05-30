import connectToDatabase from "../../../server/utils/db"
import Layout from "../../../server/models/layout"

const isProduction = process.env.NODE_ENV === 'production';

async function _getAsset(fieldValue, token_type, access_token) {
  const getAssetUrl = fieldValue.links.self;
  return await fetch(getAssetUrl, {
    method: 'get',
    headers: {
      'Authorization': `${token_type} ${access_token}`,
    }
  }).then(res => res.json());
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const payload = req.body;

    try {
      if (payload.event_name === 'content_preview_requested') {
        console.log('content_preview_requested event received');

        const data = payload.data.assets.structured_contents[0].content_body;
        const content_hash = data.fields_version.content_hash;
        const instance_guid = payload.data.organization.id;

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
            "client_id": "0e8f7501-f679-4e0d-86c0-faf4d5bf0511",
            "client_secret": "ec83991b6feeb7f43da0ee6aabb082aa8149bf6310aea7a5579a2cccd3e3b8ea",
            "grant_type": "client_credentials"
          })
        }).then(res => res.json());
        console.log('Token generated for content_hash', content_hash);


        const links = payload.data.links;
        const acknowledgeLink = isProduction ? links.acknowledge : `http://host.docker.internal:5010/public-api/v3/organizations/${instance_guid}/structured-content/${links.acknowledge.split('/v3/structured-content/')[1]}`
        const completeLink = isProduction ? links.complete : `http://host.docker.internal:5010/public-api/v3/organizations/${instance_guid}/structured-content/${links.complete.split('/v3/structured-content/')[1]}`

        const acknowledgedResponse = await fetch(acknowledgeLink, {
          method: 'post',
          body: JSON.stringify({
            acknowledged_by: 'website',
            content_hash
          }),
          headers: {
            'Authorization': `${token_type} ${access_token}`,
            'Content-Type': 'application/json'
          }
        });
        if (acknowledgedResponse.status !== 202) {
          const error = await acknowledgedResponse.json();
          console.log('Could not trigger acknowledged event', error);
          res.status(500).json({ message: 'Could not trigger acknowledged event', error });
          return;
        }
        console.log(`${acknowledgeLink} completed`);

        const fields = data.fields_version.fields;
        const mainCTA = fields.mainCTA?.[0].field_values[0].content_details.latest_fields_version.fields;
        const mission = fields.missionSection?.[0].field_values[0].content_details.latest_fields_version.fields;
        const vision = fields.visionSection?.[0].field_values[0].content_details.latest_fields_version.fields;
        const products = fields.productsSection?.[0].field_values[0].content_details.latest_fields_version.fields;
        const contactUs = fields.contactUsSection?.[0].field_values[0].content_details.latest_fields_version.fields;
        const joinUs = fields.joinUsSection?.[0].field_values[0].content_details.latest_fields_version.fields;

        const getMainCTAData = async () => {
          const title = mainCTA.title[0].field_values[0].text_value;
          const description = mainCTA.description[0].field_values[0].text_value;
          const ctaText = mainCTA.cTAText[0].field_values[0].text_value;
          const imageFieldValue = mainCTA.image?.[0].field_values[0].asset_guid;
          let image;

          if (imageFieldValue) {
            const asset = await _getAsset(mainCTA.image[0].field_values[0], token_type, access_token);
            image = asset.url;
          }

          return {
            title,
            description,
            ctaText,
            image
          }
        };

        const getMissionData = async () => {
          const title = mission.title[0].field_values[0].text_value;
          const description = mission.description[0].field_values[0].text_value;
          const video = mission.videoURL[0].field_values[0].url;
          const videoThumbnailFieldValue = mission.videoThumbnail?.[0].field_values[0].asset_guid;
          const backgroundImagelFieldValue = mission.backgroundImage?.[0].field_values[0].asset_guid;
          let videoThumbnail;
          let backgroundImage

          if (videoThumbnailFieldValue) {
            const asset = await _getAsset(mission.videoThumbnail[0].field_values[0], token_type, access_token);
            videoThumbnail = asset.url;
          }

          if (backgroundImagelFieldValue) {
            const asset = await _getAsset(mission.backgroundImage[0].field_values[0], token_type, access_token);
            backgroundImage = asset.url;
          }

          return {
            title,
            description,
            video,
            videoThumbnail,
            backgroundImage
          }
        };

        const layoutData = {
          mainCTA: mainCTA && await getMainCTAData(),
          mission: mission && await getMissionData(),
          vision: vision && {
            ctas: vision.cTAs[0].field_values.map(value => {
              const field = value.content_details.latest_fields_version.fields;

              return {
                title: field.title[0].field_values[0].text_value,
                description: field.description[0].field_values[0].text_value,
                backgroundImage: 'test',
              }
            })
          },
          products: products && {
            title: products.title[0].field_values[0].text_value,
            description: products.description[0].field_values[0].text_value,
            slider: products.slider[0].field_values.map(value => {
              const field = value.content_details.latest_fields_version.fields;

              return {
                title: field.title[0].field_values[0].text_value,
                description: field.description[0].field_values[0].text_value,
                backgroundImage: 'test',
              }
            })
          },
          contactUs: contactUs && {
            title: contactUs.title[0].field_values[0].text_value,
            description: contactUs.description[0].field_values[0].text_value,
            location: {
              latitude: contactUs.location?.[0].field_values[0].latitude,
              longitude: contactUs.location?.[0].field_values[0].longitude,
            },
            addressText: contactUs.addressText[0].field_values[0].text_value,
          },
          joinUs: joinUs && {
            title: joinUs.title[0].field_values[0].text_value,
            ctaText: joinUs.cTAText[0].field_values[0].text_value,
          },
        };

        await connectToDatabase();
        const layout = new Layout(layoutData);
        const newLayout = await layout.save();

        console.log(`Created Layout - ${newLayout._id}`);

        const completedResponse = await fetch(completeLink, {
          method: 'post',
          body: JSON.stringify({
            keyedPreviews: {
              [(new Date()).toUTCString()]: isProduction ? `https://test-blog-sepia.vercel.app/layout/${newLayout._id}` : `https://643c-118-179-82-109.ngrok.io/layout/${newLayout._id}`
            }
          }),
          headers: {
            'Authorization': `${token_type} ${access_token}`,
            'Content-Type': 'application/json'
          }
        });
        if (completedResponse.status !== 202) {
          const error = await completedResponse.json();
          console.log({ message: 'Could not trigger complete event', error: JSON.stringify(error) });
          res.status(500).json({ message: 'Could not trigger complete event', error: JSON.stringify(error) });
          return;
        }
        console.log(`${completeLink} completed`);

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
