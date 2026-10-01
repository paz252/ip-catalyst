import { InternationalPatentMsmeCreateEditForm } from "./internationalPatent-create-edit-form-msme";
import { InternationalPatentDefaultCreateEditForm } from "./internationalPatent-create-edit-form-default";
import { InternationalPatentStartupCreateEditForm } from "./internationalPatent-create-edit-form-startup";

export function InternationalPatentCreateEditForm({ internationalPatent, role }) {
  console.log('User role:', role);
  console.log("patent:",internationalPatent);

  if (role === 'STARTUP') {
    return <InternationalPatentStartupCreateEditForm internationalPatent={internationalPatent} role={role} />;
  }

  if (role === 'MSME') {
    return <InternationalPatentMsmeCreateEditForm internationalPatent={internationalPatent} role={role} />;
  }

  return <InternationalPatentDefaultCreateEditForm internationalPatent={internationalPatent} role={role} />;
}