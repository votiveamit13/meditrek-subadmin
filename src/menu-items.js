import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupIcon from '@mui/icons-material/Group';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import StarPurple500Icon from '@mui/icons-material/StarPurple500';
import CategoryIcon from '@mui/icons-material/Category';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DifferenceIcon from '@mui/icons-material/Difference';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import BroadcastOnHomeIcon from '@mui/icons-material/BroadcastOnHome';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { APP_PREFIX_PATH } from "../src/config";

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  StarPurple500Icon: StarPurple500Icon,
  CategoryIcon: CategoryIcon,
  GroupIcon: GroupIcon,
  DifferenceIcon: DifferenceIcon,
  PhotoLibraryIcon: PhotoLibraryIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon,
  ContactPhoneIcon: ContactPhoneIcon,
  BroadcastOnHomeIcon: BroadcastOnHomeIcon,
  BackupTableIcon: BackupTableIcon,
  AutoGraphIcon: AutoGraphIcon,
  PersonRemoveIcon: PersonRemoveIcon,
  CollectionsBookmarkIcon: CollectionsBookmarkIcon,
  VerifiedUserIcon: VerifiedUserIcon,
  SummarizeIcon: SummarizeIcon,
};

// eslint-disable-next-line
export default {
  items: [
    {
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: APP_PREFIX_PATH + '/dashboard'
        },


        {
          id: 'managePatient',
          title: 'Manage Patients',
          type: 'item',
          icon: icons['VerifiedUserIcon'],
          url: APP_PREFIX_PATH + '/manage-patients'
        },
     
        {
          id: 'tabularReport',
          title: 'Tabular Report',
          type: 'collapse',
          icon: icons['BackupTableIcon'],
          children: [
           
            {
              id: 'sharedReport',
              title: 'Shared Information',
              type: 'item',
              icon: icons['MedicationIcon'],
              url: APP_PREFIX_PATH + '/tabular-report/shared-report'
            },
          ]
        },
         {
              id: 'manageFaq',
              title: 'Manage Faq',
              type: 'item',
              icon: icons['SummarizeIcon'],
              url: APP_PREFIX_PATH + '/manage-faq'
            },
            {
              id: 'manageContactUs',
              title: 'Manage Help & Support',
              type: 'item',
              icon: icons['ContactPhoneIcon'],
              url: APP_PREFIX_PATH + '/manage-contact-us'
            }

      ]
    }



  ]
};
