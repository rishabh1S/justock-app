import React, { useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  Text,
  View,
  XStack,
  Image,
  Button,
  YStack,
  ThemeName,
  ScrollView,
} from "tamagui";
import {
  SectionList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
const categories = ["Overview", "News", "Orders", "Transactions"];

interface CTAProps {
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  theme: ThemeName | null | undefined;
}
const CTA: React.FC<CTAProps> = ({ text, icon, backgroundColor, theme }) => {
  return (
    <Button
      paddingHorizontal="$6"
      borderRadius="$8"
      backgroundColor={backgroundColor}
      theme={theme}
      icon={<Ionicons name={icon} size={24} color="white" />}
    >
      {text}
    </Button>
  );
};

const DetailsPage = () => {
  const { id } = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const [activeIndex, setActiveIndex] = useState(0);
  const colorScheme = useColorScheme() as "light" | "dark";

  const { data } = useQuery({
    queryKey: ["info", id],
    queryFn: async () => {
      const info = await fetch(`/api/info?ids=${id}`).then((res) => res.json());
      return info[+id];
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: data?.name }} />
      <SectionList
        style={{ marginTop: headerHeight }}
        keyExtractor={(i) => i.title}
        contentInsetAdjustmentBehavior="automatic"
        sections={[{ data: [{ title: "Chart" }] }]}
        renderSectionHeader={() => (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              padding: "$3.5",
              backgroundColor: Colors[colorScheme].background,
              borderBottomColor: "$color8",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          >
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveIndex(index)}
                style={{
                  padding: 10,
                  paddingHorizontal: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    activeIndex === index
                      ? Colors[colorScheme === "dark" ? "light" : "dark"]
                          .background
                      : Colors[colorScheme].background,
                  borderRadius: 20,
                }}
              >
                <Text color={activeIndex === index ? "$color1" : "$color10"}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        ListHeaderComponent={() => (
          <YStack marginVertical="$1.5" marginHorizontal="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={20} fontWeight="bold" color="$color11">
                {data?.symbol}
              </Text>
              <Image source={{ uri: data?.logo, width: 60, height: 60 }} />
            </XStack>
            <XStack gap="$3.5" alignItems="center">
              <CTA
                text="Buy"
                icon="add"
                backgroundColor="$green9"
                theme="green"
              />
              <CTA
                text="Recieve"
                icon="arrow-back"
                backgroundColor="$red9"
                theme="red"
              />
            </XStack>
          </YStack>
        )}
        renderItem={({ item }) => (
          <View
            margin="$4"
            padding="$3"
            borderRadius="$4"
            gap={28}
            backgroundColor="$color2"
          >
            <Text fontSize={20} fontWeight="bold" color="$color11">
              Overview
            </Text>
            <Text color="$color10">{data?.description}</Text>
          </View>
        )}
      ></SectionList>
    </>
  );
};

export default DetailsPage;
