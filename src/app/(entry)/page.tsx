import { LocaleRedirect } from "@/components/locale-redirect";
import { routing } from "@/i18n/routing";
export default function EntryPage() {
  return <LocaleRedirect locales={[...routing.locales]} />;
}
