import connectToDatabase from "../../server/utils/db"
import Post from "../../server/models/post"

const isProduction = process.env.NODE_ENV === 'production';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const payload = req.body;

    try {
      if (payload.event_name === 'content_preview_requested') {
        console.log('content_preview_requested event received');

        const data = payload.data.assets.structured_contents[0].content_body;
        const description = data.fields_version.fields.description[0].field_values[0].rich_text_value;
        const title = data.fields_version.fields.title[0].field_values[0].text_value
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
            "client_id": "e7b6981c-d667-4191-b9bd-43f10d68d398",
            "client_secret": "e078fce220e8e9c956c431f86c089359db88c17abc38329d47cb8b8dd627556d",
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

        await connectToDatabase();
        const post = await Post.create({
          title,
          description,
        });

        const completedResponse = await fetch(completeLink, {
          method: 'post',
          body: JSON.stringify({
            keyedPreviews: {
              [post._id]: `https://test-blog-sepia.vercel.app/post/${post._id}`
            }
          }),
          headers: {
            'Authorization': `${token_type} ${access_token}`,
            'Content-Type': 'application/json'
          }
        });
        if (completedResponse.status !== 202) {
          const error = await completedResponse.json();
          console.log({ message: 'Could not trigger complete event', error });
          res.status(500).json({ message: 'Could not trigger complete event', error });
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
