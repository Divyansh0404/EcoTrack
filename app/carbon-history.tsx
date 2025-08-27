import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LineChart, BarChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";

const mockEmissions = [12, 25, 18, 30, 20, 28, 24];
const mockDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const materialFilters = ["All", "Plastic", "Glass", "Metal", "Textile"];

export default function CarbonHistory() {
  const isFocused = useIsFocused();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [chartType, setChartType] = useState("line");
  const [logs, setLogs] = useState<any[]>([]);

  const filteredLogs =
    selectedFilter === "All"
      ? logs
      : logs.filter((log) => log.material === selectedFilter);

  const fadeAnim = new Animated.Value(0);

  const loadLogs = async () => {
    try {
      const data = await AsyncStorage.getItem("logs");
      if (data) {
        setLogs(JSON.parse(data));
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("Failed to load logs:", err);
    }
  };

  useEffect(() => {
    if (isFocused) loadLogs();
  }, [isFocused]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [logs]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📈 Weekly Carbon Emissions</Text>

      <View style={styles.chartWrapper}>
        <YAxis
          data={mockEmissions}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{ fill: "#666", fontSize: 12 }}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          {chartType === "line" ? (
            <LineChart
              style={{ height: 200 }}
              data={mockEmissions}
              svg={{ stroke: "#2E7D32", strokeWidth: 3 }}
              contentInset={{ top: 20, bottom: 20 }}
              curve={shape.curveNatural}
            >
              <Grid />
            </LineChart>
          ) : (
            <BarChart
              style={{ height: 200 }}
              data={mockEmissions}
              svg={{ fill: "#2E7D32" }}
              contentInset={{ top: 20, bottom: 20 }}
            >
              <Grid />
            </BarChart>
          )}
          <XAxis
            style={{ marginTop: 10 }}
            data={mockEmissions}
            formatLabel={(value, index) => mockDays[index]}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 12, fill: "#444" }}
          />
        </View>
      </View>

      <Text style={styles.subTitle}>🧾 Recent Logs</Text>

      <View style={styles.filterContainer}>
        {materialFilters.map((material) => (
          <TouchableOpacity
            key={material}
            onPress={() => setSelectedFilter(material)}
            style={[
              styles.filterButton,
              selectedFilter === material && styles.selectedFilter,
            ]}
          >
            <Text
              style={{
                color: selectedFilter === material ? "#fff" : "#2E7D32",
                fontWeight: "600",
              }}
            >
              {material}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <View style={styles.cardLeft}>
              <MaterialCommunityIcons
                name="leaf"
                size={28}
                color="#2E7D32"
                style={{ marginRight: 12 }}
              />
              <View>
                <Text style={styles.material}>{item.material}</Text>
                <Text style={styles.amount}>{item.amount}</Text>
              </View>
            </View>
            <Text style={styles.emission}>
              {item.emission?.includes("kg") ? item.emission : `${item.emission} kg CO₂`}
            </Text>
          </Animated.View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => alert("Add new log from the Log screen")}
      >
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.chartToggle}
        onPress={() => setChartType(chartType === "line" ? "bar" : "line")}
      >
        <Text style={styles.toggleText}>
          Switch to {chartType === "line" ? "Bar" : "Line"} Chart
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#F4F7F6",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 12,
  },
  chartWrapper: {
    flexDirection: "row",
    height: 220,
    paddingRight: 16,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 20,
  },
  selectedFilter: {
    backgroundColor: "#2E7D32",
  },
  card: {
    backgroundColor: "#fff",
    marginVertical: 6,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  material: {
    fontSize: 16,
    fontWeight: "600",
  },
  amount: {
    fontSize: 13,
    color: "#666",
  },
  emission: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#2E7D32",
    padding: 16,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  chartToggle: {
    position: "absolute",
    bottom: 100,
    left: 20,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
});