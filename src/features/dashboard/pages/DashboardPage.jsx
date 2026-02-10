import WelcomeCard from "../components/WelcomeCard";
import UploadTransactionsCard from "../components/UploadTransactionsCard ";
import TransactionsSummary from "../components/TransactionsSummary";
import HelpCard from "../components/HelpCard";

import PageContainer from "../../../shared/components/PageContainer";

export default function DashboardPage() {
  return (
    <PageContainer>
      <WelcomeCard />
      <UploadTransactionsCard />
      <TransactionsSummary />
      <HelpCard />
    </PageContainer>
  );
}
