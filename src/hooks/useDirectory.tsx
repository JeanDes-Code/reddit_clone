/* eslint-disable react-hooks/exhaustive-deps */
import {
  defaultMenuItem,
  DirectoryMenuItem,
  directoryMenuState,
} from '@/atoms/directoryMenuAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { communityState } from '@/atoms/communitiesAtom';
import { FaReddit } from 'react-icons/fa';

const useDirectory = () => {
  const [directoryState, setDirectoryState] =
    useRecoilState(directoryMenuState);
  const router = useRouter();
  const communityStateValue = useRecoilValue(communityState);

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({ ...prev, isOpen: !directoryState.isOpen }));
  };

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));

    router?.push(menuItem.link);
    if (directoryState.isOpen) {
      toggleMenuOpen();
    }
  };

  useEffect(() => {
    const { community } = router.query;

    // const existingCommunity =
    //   communityStateValue.visitedCommunities[community as string];

    const existingCommunity = communityStateValue.currentCommunity;

    if (existingCommunity.id) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${existingCommunity.id}`,
          link: `r/${existingCommunity.id}`,
          icon: FaReddit,
          iconColor: 'blue.500',
          imageURL: existingCommunity.imageURL,
        },
      }));
      return;
    }
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: defaultMenuItem,
    }));
  }, [communityStateValue.currentCommunity]);

  return {
    directoryState,
    toggleMenuOpen,
    onSelectMenuItem,
  };
};
export default useDirectory;
