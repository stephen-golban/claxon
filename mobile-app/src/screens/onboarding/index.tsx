import React from "react";

import { useWelcomeSlides } from "./constants";

import { Container } from "@/components/common";
import { OnboardingHeader } from "@/components/common/headers";
import { Stack } from "expo-router";
import { WelcomeButtons, WelcomeIndicators, WelcomePager } from "./components";

export default function OnboardingScreen() {
  const slides = useWelcomeSlides();
  const [currentPage, setCurrentPage] = React.useState(0);

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const handleBack = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const showBackButton = currentPage === 2;
  const { headerLeft, ...Header } = OnboardingHeader;

  return (
    <>
      <Stack.Screen
        options={{
          ...Header,
          headerShown: true,
          headerLeft: () => headerLeft(showBackButton, handleBack),
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
