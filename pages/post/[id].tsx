import Post from '../../server/models/post';
import connectToDatabase from '../../server/utils/db';

const PostPage = ({ post }) => {
  return (
    <div className="font-sans leading-normal tracking-normal">
      <div className="container w-full md:max-w-3xl mx-auto pt-20">
        <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal">
          <div className="font-sans">
            <h1 className="font-bold font-sans break-normal text-gray-900 pt-6 pb-2 text-3xl md:text-4xl">{post.title}</h1>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.description || '<p>Empty Body! Please add something in description</p>' }} />
        </div>
      </div>
    </div>
  )
}

export default PostPage;

export async function getServerSideProps({ query }) {
  try {
    await connectToDatabase();
    const post = await Post.findById(query.id).lean();
    return { props: { post: { title: post.title, description: post.description } } }
  } catch (err) {
    return { props: { post: { title: 'Something Went Wrong' } } }
  }
}