import { Interface__NavGroup } from "@/constants/interfaces";
import {
  ActivityIcon,
  BrainCircuitIcon,
  BrushIcon,
  DatabaseIcon,
  FilePenLineIcon,
  HomeIcon,
  LanguagesIcon,
  LockKeyholeIcon,
  ScanTextIcon,
  SettingsIcon,
  ShieldHalfIcon,
  SquarePenIcon,
  TimerIcon,
  UserCogIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

// 1 super admin
// 2 admin
// 3 public

export const PREFIX_ADMIN_ROUTES = "/admin";

export const PRIVATE_NAV_GROUPS: Interface__NavGroup[] = [
  {
    labelKey: "main",
    navs: [
      {
        icon: SquarePenIcon,
        labelKey: "navs.new_chat",
        path: "/new-chat",
        allowedRoles: [],
        allowedPermissions: [],
      },
      {
        icon: ScanTextIcon,
        labelKey: "navs.new_document_analysis",
        path: "/new-da",
        allowedRoles: [],
        allowedPermissions: [],
      },
      {
        icon: FilePenLineIcon,
        labelKey: "navs.create_letter",
        label: "Buat Surat", // Fallback label in case translations don't have it yet
        path: "/download-surat",
        allowedRoles: [],
        allowedPermissions: [],
      },
      {
        icon: TimerIcon,
        labelKey: "navs.service_trial",
        path: "/service-trial",
        allowedRoles: [],
        allowedPermissions: [],
      },
      // {
      //   icon: FileTextIcon,
      //   labelKey: "navs.your_da",
      //   path: "/your-da",
      //   allowedRoles: [],
      //   allowedPermissions: [],
      // },
    ],
  },
];
export const ADMIN_PRIVATE_NAV_GROUPS: Interface__NavGroup[] = [
  {
    labelKey: "main",
    navs: [
      {
        icon: HomeIcon,
        labelKey: "admin_navs.home",
        path: `/admin/home`,
        allowedRoles: [],
        allowedPermissions: [],
      },
      {
        icon: UsersIcon,
        labelKey: "admin_navs.user",
        path: `/admin/user`,
        allowedRoles: [],
        allowedPermissions: [],
      },
      {
        icon: BrainCircuitIcon,
        labelKey: "admin_navs.ai_knowledge",
        path: `/admin/ai-knowledge`,
        allowedRoles: [],
        allowedPermissions: [],
      },
      {
        icon: ScanTextIcon,
        labelKey: "admin_navs.da_service",
        path: `/admin/da-service`,
        allowedRoles: [1],
        allowedPermissions: [],
      },
    ],
  },
];

export const OTHER_PRIVATE_NAV_GROUPS: Interface__NavGroup[] = [
  {
    labelKey: "other",
    navs: [
      {
        icon: SettingsIcon,
        labelKey: "navs.settings",
        path: `/settings`,
        allowedRoles: [],
        allowedPermissions: [],
        children: [
          {
            labelKey: "settings_navs.main.index",
            navs: [
              {
                icon: UserIcon,
                labelKey: "my_profile",
                path: `/settings/profile`,
                allowedRoles: [],
                allowedPermissions: [],
                backPath: `/settings`,
              },
              {
                icon: LanguagesIcon,
                labelKey: "settings_navs.main.regional",
                path: `/settings/regional`,
                allowedRoles: [],
                allowedPermissions: [],
                backPath: `/settings`,
              },
              {
                icon: BrushIcon,
                labelKey: "settings_navs.main.personalization",
                path: `/settings/personalization`,
                allowedRoles: [],
                allowedPermissions: [],
                backPath: `/settings`,
              },
              {
                icon: ShieldHalfIcon,
                labelKey: "settings_navs.main.app_permissions",
                path: `/settings/app-permissions`,
                allowedRoles: [],
                allowedPermissions: [],
                backPath: `/settings`,
              },
            ],
          },
        ],
      },
    ],
  },
];
export const ADMIN_OTHER_PRIVATE_NAV_GROUPS: Interface__NavGroup[] = [
  {
    labelKey: "others",
    navs: [
      {
        icon: LockKeyholeIcon,
        labelKey: "navs.master_data",
        path: `/admin/master-data`,
        allowedRoles: [],
        allowedPermissions: [],
        children: [
          {
            labelKey: "master_data_navs.hr.index",
            navs: [
              {
                icon: UserCogIcon,
                labelKey: "master_data_navs.hr.employment_status",
                path: `/admin/master-data/employment-status`,
                allowedRoles: [],
                allowedPermissions: [],
                backPath: `/master-data`,
              },
            ],
          },
        ],
      },

      {
        icon: SettingsIcon,
        labelKey: "navs.settings",
        path: `/admin/settings`,
        allowedRoles: [],
        allowedPermissions: [],
        children: [
          {
            labelKey: "settings_navs.main.index",
            navs: [
              {
                icon: UserIcon,
                labelKey: "my_profile",
                path: `/admin/settings/profile`,
                allowedRoles: [],
                allowedPermissions: [],
                backPath: `/admin/settings`,
              },
              {
                icon: LanguagesIcon,
                labelKey: "settings_navs.main.regional",
                path: `/admin/settings/regional`,
                allowedRoles: [],
                allowedPermissions: [],
                backPath: `/admin/settings`,
              },
              {
                icon: BrushIcon,
                labelKey: "settings_navs.main.personalization",
                path: `/admin/settings/personalization`,
                allowedRoles: [],
                allowedPermissions: [],
                backPath: `/admin/settings`,
              },
              {
                icon: ShieldHalfIcon,
                labelKey: "settings_navs.main.app_permissions",
                path: `/admin/settings/app-permissions`,
                allowedRoles: [],
                allowedPermissions: [],
                backPath: `/admin/settings`,
              },
            ],
          },
        ],
      },
      {
        icon: DatabaseIcon,
        labelKey: "navs.master_data",
        path: `/admin/security`,
        allowedRoles: [],
        allowedPermissions: [],
        children: [
          {
            labelKey: "security_navs.index",
            navs: [
              {
                icon: UserCogIcon,
                labelKey: "security_navs.role_permissions",
                path: `/admin/security/role-permission`,
                allowedRoles: [],
                allowedPermissions: [],
                backPath: `./admin/security`,
              },
              {
                icon: ActivityIcon,
                labelKey: "security_navs.activity_log",
                path: `/admin/security/activity-log`,
                allowedRoles: [],
                allowedPermissions: [],
                backPath: `/admin/security`,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const RESOLVED_NAVS = [
  ...PRIVATE_NAV_GROUPS,
  ...ADMIN_PRIVATE_NAV_GROUPS,
  ...OTHER_PRIVATE_NAV_GROUPS,
  ...ADMIN_OTHER_PRIVATE_NAV_GROUPS,
];
