import { Interface__NavGroup } from "@/constants/interfaces";
import {
  BrainCircuitIcon,
  BrushIcon,
  FilePenLineIcon,
  LanguagesIcon,
  LayoutDashboardIcon,
  ScanTextIcon,
  SettingsIcon,
  ShieldHalfIcon,
  SquarePenIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

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

export const RESOLVED_NAVS = [
  ...PRIVATE_NAV_GROUPS,
  ...OTHER_PRIVATE_NAV_GROUPS,
  ...ADMIN_PRIVATE_NAV_GROUPS,
];
