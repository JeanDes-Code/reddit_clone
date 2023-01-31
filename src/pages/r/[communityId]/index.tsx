import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { firestore } from '@/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { Community } from '@/atoms/communitiesAtom';
import safeJsonStringify from 'safe-json-stringify';
import CommunityNotFound from '@/components/Community/CommunityNotFound';
import Header from '@/components/Community/Header';
import PageContent from '@/components/Layout/PageContent';
import CreatePostLink from '@/components/Community/CreatePostLink';

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  if (!communityData) return <CommunityNotFound />;

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
        </>
        <>
          <div>Right</div>
        </>
      </PageContent>
    </>
  );
};

export default CommunityPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      firestore,
      'communities',
      context.query.communityId as string,
    );
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({
                id: communityDoc.id,
                ...communityDoc.data(),
              }),
            )
          : '',
      },
    };
  } catch (error) {
    // Could create error page here
    console.log('getServerSideProps error - [community]', error);
  }
}
