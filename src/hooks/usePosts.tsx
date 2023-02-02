import { useRecoilState } from 'recoil';

import { Post, postState } from '@/atoms/postsAtom';
import { firestore, storage } from '@/firebase/clientApp';
import { ref, deleteObject } from 'firebase/storage';
import { deleteDoc, doc } from 'firebase/firestore';

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async () => {};
  const onSelectPost = () => {};
  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      //check if image and delete
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }
      // delete post document from firestore
      const postDocRef = doc(firestore, 'posts', post.id!);
      await deleteDoc(postDocRef);
      //update recoil state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));

      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};
export default usePosts;
