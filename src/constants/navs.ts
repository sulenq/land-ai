import { Interface__NavGroup } from "@/constants/interfaces";
import {
  ActivityIcon,
  BrainCircuitIcon,
  BrushIcon,
  DatabaseIcon,
  LanguagesIcon,
  LayoutDashboardIcon,
  LockKeyholeIcon,
  ScanTextIcon,
  SettingsIcon,
  ShieldHalfIcon,
  SquarePenIcon,
  UserCogIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

export const PRIVATE_NAV_GROUPS: Interface__NavGroup[] = [
  {
    labelKey: "main",
    navs: [
      {
        icon: SquarePenIcon,
        labelKey: "navs.new_chat",
        path: "/new-chat",
        allowedPermissions: [],
      },
      {
        icon: ScanTextIcon,
        labelKey: "navs.new_document_analysis",
        path: "/new-da",
        allowedPermissions: [],
      },
      // {
      //   icon: LayoutDashboardIcon,
      //   labelKey: "navs.dashboard",
      //   path: `/dashboard`,
      //   allowedPermissions: [],
      // },
      // {
      //   icon: UsersIcon,
      //   labelKey: "navs.user",
      //   path: `/user`,
      //   allowedPermissions: [],
      // },
      // {
      //   icon: MapPinIcon,
      //   labelKey: "navs.other.index",
      //   path: `/other-navs`,
      //   allowedPermissions: [],
      //   children: [
      //     {
      //       navs: [
      //         {
      //           labelKey: "navs.other.type",
      //           path: `/other-navs/type`,
      //           allowedPermissions: [],
      //         },
      //         {
      //           labelKey: "navs.other.category",
      //           path: `/other-navs/category`,
      //           allowedPermissions: [],
      //         },
      //         {
      //           labelKey: "navs.other.index",
      //           path: `/other-navs/other`,
      //           allowedPermissions: [],
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
  },
];
export const OTHER_PRIVATE_NAV_GROUPS: Interface__NavGroup[] = [
  {
    labelKey: "other",
    navs: [
      // {
      //   icon: DatabaseIcon,
      //   labelKey: "navs.master_data",
      //   path: `/master-data`,
      //   allowedPermissions: [],
      //   children: [
      //     {
      //       labelKey: "master_data_navs.hr.index",
      //       navs: [
      //         {
      //           icon: UserCogIcon,
      //           labelKey: "master_data_navs.hr.employment_status",
      //           path: `/master-data/employment-status`,
      //           allowedPermissions: [],
      //           backPath: `/master-data`,
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        icon: SettingsIcon,
        labelKey: "navs.settings",
        path: `/settings`,
        allowedPermissions: [],
        children: [
          {
            labelKey: "settings_navs.main.index",
            navs: [
              {
                icon: UserIcon,
                labelKey: "my_profile",
                path: `/settings/profile`,
                allowedPermissions: [],
                backPath: `/settings`,
              },
              {
                icon: LanguagesIcon,
                labelKey: "settings_navs.main.regional",
                path: `/settings/regional`,
                allowedPermissions: [],
                backPath: `/settings`,
              },
              {
                icon: BrushIcon,
                labelKey: "settings_navs.main.personalization",
                path: `/settings/personalization`,
                allowedPermissions: [],
                backPath: `/settings`,
              },
              {
                icon: ShieldHalfIcon,
                labelKey: "settings_navs.main.app_permissions",
                path: `/settings/app-permissions`,
                allowedPermissions: [],
                backPath: `/settings`,
              },
            ],
          },
          // {
          //   labelKey: "settings_navs.system.index",
          //   navs: [
          //     {
          //       icon: UserCogIcon,
          //       labelKey: "settings_navs.system.account_role",
          //       path: `/settings/account-role`,
          //       allowedPermissions: [],
          //       backPath: `/settings`,
          //     },
          //     {
          //       icon: BlocksIcon,
          //       labelKey: "settings_navs.system.integration",
          //       path: `/settings/integration`,
          //       allowedPermissions: [],
          //       backPath: `/settings`,
          //     },
          //     {
          //       icon: ActivityIcon,
          //       labelKey: "settings_navs.system.activity_log",
          //       path: `/settings/activity-log`,
          //       allowedPermissions: [],
          //       backPath: `/settings`,
          //     },
          //   ],
          // },
        ],
      },
    ],
  },
];

export const ADMIN_PRIVATE_NAV_GROUPS: Interface__NavGroup[] = [
  {
    labelKey: "main",
    navs: [
      {
        icon: LayoutDashboardIcon,
        labelKey: "admin_navs.dashboard",
        path: `/admin/dashboard`,
        allowedPermissions: [],
      },
      {
        icon: UsersIcon,
        labelKey: "admin_navs.user",
        path: `/admin/user`,
        allowedPermissions: [],
      },
      {
        icon: BrainCircuitIcon,
        labelKey: "admin_navs.ai_knowledge",
        path: `/admin/ai-knowledge`,
        allowedPermissions: [],
      },
      // {
      //   icon: FilesIcon,
      //   labelKey: "admin_navs.da_service",
      //   path: `/admin/da-service`,
      //   allowedPermissions: [],
      // },
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
        allowedPermissions: [],
        children: [
          {
            labelKey: "master_data_navs.hr.index",
            navs: [
              {
                icon: UserCogIcon,
                labelKey: "master_data_navs.hr.employment_status",
                path: `/admin/master-data/employment-status`,
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
        allowedPermissions: [],
        children: [
          {
            labelKey: "settings_navs.main.index",
            navs: [
              {
                icon: UserIcon,
                labelKey: "my_profile",
                path: `/admin/settings/profile`,
                allowedPermissions: [],
                backPath: `/admin/settings`,
              },
              {
                icon: LanguagesIcon,
                labelKey: "settings_navs.main.regional",
                path: `/admin/settings/regional`,
                allowedPermissions: [],
                backPath: `/admin/settings`,
              },
              {
                icon: BrushIcon,
                labelKey: "settings_navs.main.personalization",
                path: `/admin/settings/personalization`,
                allowedPermissions: [],
                backPath: `/admin/settings`,
              },
              {
                icon: ShieldHalfIcon,
                labelKey: "settings_navs.main.app_permissions",
                path: `/admin/settings/app-permissions`,
                allowedPermissions: [],
                backPath: `/admin/settings`,
              },
            ],
          },

          // {
          //   labelKey: "settings_navs.system.index",
          //   navs: [
          //     {
          //       icon: BlocksIcon,
          //       labelKey: "settings_navs.system.integration",
          //       path: `/admin/settings/integration`,
          //       allowedPermissions: [],
          //       backPath: `/admin/settings`,
          //     },
          //   ],
          // },
        ],
      },

      {
        icon: DatabaseIcon,
        labelKey: "navs.master_data",
        path: `/admin/security`,
        allowedPermissions: [],
        children: [
          {
            labelKey: "security_navs.index",
            navs: [
              {
                icon: UserCogIcon,
                labelKey: "security_navs.role_permissions",
                path: `/admin/security/role-permission`,
                allowedPermissions: [],
                backPath: `./admin/security`,
              },
              {
                icon: ActivityIcon,
                labelKey: "security_navs.activity_log",
                path: `/admin/security/activity-log`,
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
