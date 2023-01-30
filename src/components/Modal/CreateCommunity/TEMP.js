// OPT 1:
// const COMMUNITY = {
//   id: 'communityId',
//   /**
//    *
//    */
//   users: ['userId1', 'userId2', '........', 'userId4843'],
//   // As there will be (on a reddit-like platform) a potentially
//   // infinite number of users, this approach is not optimal.
// };

// const USER = {
//   id: 'userId1',
//   /**
//    *
//    */
//   communities: ['communityId1', 'communityId2', 'communityId4843'],
// };

// OPT 2 - SQL APPROACH:
// const USER_COMMUNITY = {
//   userID: 'userId1',
//   communityID: 'communityId1',
// }; //SQL Join table is not supported by Firestore

// OPT 3 THE APPROACH WE WILL USE :
// const USER = {
//   id: 'userId1',
//   /**
//    *
//    */
//   // subcollection
//   communitySnippets: [
//     {
//       communityId: 'communityId1',
//       // + few other fields
//     },
//     {
//       communityId: 'communityId2',
//     },
//     /**
//      *
//      */
//     {
//       communityId: 'communityId4843',
//     },
//   ],
// };

// const COMMUNITY = {
//   id: 'communityId',
//   numOfMembers: '47876767683854574654',
// };
// we only need some infos about the community (like name and picture) so this is a good approach for our app
