import PageContainer from "../shared/components/PageContainer";
import HeroSection from "../shared/components/HeroSection";
import InfoCard from "../shared/components/InfoCard";
import HowItWorks from "../shared/components/HowItWorks";
import CallToAction from "../shared/components/CallToAction";

export default function HomePage() {
  return (
    <PageContainer>
      <HeroSection
        title="Simple Crypto Tax & Transaction Tracking"
        subtitle="Track your crypto trades, calculate tax automatically, and stay compliant — even if you are not technical."
        primaryAction={{ label: "Create Free Account", to: "/auth/register" }}
        secondaryAction={{ label: "Log In", to: "/auth/login" }}
      />

      <InfoCard
        title="Why people trust this app"
        items={[
          "No technical knowledge required",
          "Supports many cryptocurrencies and stablecoins",
          "Automatic FIFO tax calculations",
          "Designed for everyday people",
        ]}
      />

      <HowItWorks
        steps={[
          {
            step: 1,
            title: "Create an account",
            description: "Sign up using your email and password.",
          },
          {
            step: 2,
            title: "Add your transactions",
            description: "Record buys, sells, and trades in simple terms.",
          },
          {
            step: 3,
            title: "View tax results",
            description: "We calculate gains and losses for you automatically.",
          },
        ]}
      />

      <CallToAction
        message="You don’t need to understand crypto or tax laws. We handle everything for you."
        button={{ label: "Get Started Now", to: "/auth/register" }}
      />
    </PageContainer>
  );
}
