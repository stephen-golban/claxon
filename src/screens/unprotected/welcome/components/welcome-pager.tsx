import LottieView from "lottie-react-native";
import React from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, { FadeInRight, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Text } from "@/components/ui/text";

interface WelcomePagerProps extends React.PropsWithChildren {
  data: {
    title: string;
    description: string;
    icon: string;
  }[];
  currentPage: number;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

export function WelcomePager({ currentPage, children, data }: WelcomePagerProps) {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const lottieRefs = React.useRef<(LottieView | null)[]>([]);
  const isFirstRender = React.useRef(true);

  // Initialize refs array with nulls
  React.useEffect(() => {
    lottieRefs.current = new Array(data.length).fill(null);
    return () => {
      // Cleanup refs on unmount
      lottieRefs.current = [];
    };
  }, [data.length]);

  React.useEffect(() => {
    if (isFirstRender.current) {
      translateX.value = -currentPage * width;
      isFirstRender.current = false;
    } else {
      translateX.value = withSpring(-currentPage * width, {
        damping: 20,
        stiffness: 90,
      });
    }

    // Stop all animations first
    for (const ref of lottieRefs.current) {
      ref?.pause();
    }

    // Then play only the current one
    const currentRef = lottieRefs.current[currentPage];
    if (currentRef) {
      currentRef.reset();
      currentRef.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, width, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="flex-1 relative">
      <Animated.View
        style={[
          {
            width: width * data.length,
            flexDirection: "row",
          },
          animatedStyle,
        ]}
      >
        {data.map((slide, index) => (
          <View key={`slide-${slide.title}-${index}`} style={{ width }} className="px-5">
            <Animated.View className="items-center mb-8" entering={FadeInRight.delay(100).springify()}>
              <LottieView
                ref={(ref) => {
                  if (ref) lottieRefs.current[index] = ref;
                }}
                autoPlay
                loop
                source={slide.icon}
                style={{ width: 250, height: 250 }}
              />
            </Animated.View>

            <AnimatedText className="text-4xl font-bold text-center mb-4" entering={FadeInRight.delay(150).springify()}>
              {slide.title}
            </AnimatedText>

            <AnimatedText
              className="text-center text-muted-foreground mb-8 text-lg"
              entering={FadeInRight.delay(200).springify()}
            >
              {slide.description}
            </AnimatedText>
          </View>
        ))}
      </Animated.View>

      {children}
    </View>
  );
}
