import { Stack } from "expo-router";
import React from "react";

import { Container } from "@/components/common";
import { OnboardingHeader } from "@/components/common/headers";
import { WelcomeButtons, WelcomeIndicators, WelcomePager } from "./components";
import { useWelcomeSlides } from "./constants";

export default function WelcomeScreen() {
  const slides = useWelcomeSlides();
  const [currentPage, setCurrentPage] = React.useState(0);

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const handleBack = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const { headerLeft, ...Header } = OnboardingHeader;

  return (
    <>
      <Stack.Screen
        options={{
          ...Header,
          headerShown: true,
          headerLeft: () => headerLeft(false, handleBack),
        }}
      />
      <Container removePX removeEdges={[]}>
        <WelcomePager currentPage={currentPage} data={slides}>
          <WelcomeIndicators length={slides.length} currentPage={currentPage} />
        </WelcomePager>
        <WelcomeButtons
          onBack={handleBack}
          onNext={handleNext}
          currentIndex={currentPage}
          totalSlides={slides.length}
        />
      </Container>
    </>
  );
}
