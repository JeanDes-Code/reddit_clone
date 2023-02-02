import React, { useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { AiFillCloseCircle } from 'react-icons/ai';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';

import TabItem from './TabItem';
import TextInputs from './TextInputs';
import ImageUpload from './ImageUpload';
import { Post } from '@/atoms/postsAtom';
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { firestore, storage } from '@/firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import useSelectFile from '@/hooks/useSelectFile';

type NewPostFormProps = {
  user: User;
};

const formTabs: TabItemType[] = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Images & Video',
    icon: IoImageOutline,
  },
  {
    title: 'Link',
    icon: BsLink45Deg,
  },
  {
    title: 'Poll',
    icon: BiPoll,
  },
  {
    title: 'Talk',
    icon: BsMic,
  },
];

export type TabItemType = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ user }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: '',
    body: '',
  });
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCreatePost = async () => {
    if (error) setError(false);
    const { communityId } = router.query;

    // create new post object => type Post
    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user?.uid,
      creatorDisplayName: user.email!.split('@')[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };

    setLoading(true);
    try {
      // store the post in db
      const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);

      // check for selectedFile
      if (selectedFile) {
        // store in storage => getDownloadURL (return an imageURL)
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, 'data_url');
        const downloadURL = await getDownloadURL(imageRef);

        // update post doc by adding imageURL
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
      // redirect the user back to the community page using next/router
      router.back();
    } catch (error: any) {
      console.log('handleCreatePost error: ', error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const onTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {
      target: { name, value },
    } = e;
    setTextInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} marginTop={2}>
      <Flex width="100%">
        {formTabs.map((item) => (
          <>
            <TabItem
              key={item.title}
              item={item}
              selected={item.title === selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </>
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === 'Post' && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === 'Images & Video' && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectImage={onSelectFile}
            setSelectedTab={setSelectedTab}
            setSelectedFile={setSelectedFile}
          />
        )}
        {selectedTab === 'Link' && (
          <Flex direction="column" width="100%" align="center" justify="center">
            <Flex>
              <Text>
                {' '}
                <strong>Link</strong> functionality is not available yet
              </Text>
            </Flex>
          </Flex>
        )}
        {selectedTab === 'Poll' && (
          <Flex direction="column" width="100%" align="center" justify="center">
            <Flex>
              <Text>
                <strong>Poll</strong> functionality is not available yet
              </Text>
            </Flex>
          </Flex>
        )}
        {selectedTab === 'Talk' && (
          <Flex direction="column" width="100%" align="center" justify="center">
            <Flex>
              <Text>
                <strong>Talk</strong> functionality is not available yet
              </Text>
            </Flex>
          </Flex>
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text mr={2}>Error creating post</Text>
        </Alert>
      )}
    </Flex>
  );
};

export default NewPostForm;
