import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Alert,
  Image,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Task } from "@/types/task";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TasksScreen() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    const tasks = await AsyncStorage.getItem("tasks");

    if (tasks) {
      const parsedTasks = JSON.parse(tasks);
      setTasks(parsedTasks);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;

    const Task: Task = {
      title: newTask,
      completed: false,
    };

    const updatedTasks = [...tasks, Task];

    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    setNewTask("");
    Keyboard.dismiss();
  };

  const toggleTask = async (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;

    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const deleteTask = (index: number) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updatedTasks = [...tasks];
          updatedTasks.splice(index, 1);
          await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
          setTasks(updatedTasks);
        },
      },
    ]);
  };

  const markAllDone = async () => {
    const updatedTasks = tasks.map((task) => ({
      ...task,
      completed: true,
    }));

    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const clearCompleted = async () => {
    const updatedTasks = tasks.filter((task) => !task.completed);

    if (updatedTasks.length === tasks.length) {
      Alert.alert(
        "No Completed Tasks",
        "There are no completed tasks to clear.",
      );
      return;
    }

    Alert.alert(
      "Clear Completed Tasks",
      "Are you sure you want to clear all completed tasks? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
            setTasks(updatedTasks);
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView behavior="height" className="flex-1">
      <View className="flex-1 bg-gray-50">
        <StatusBar style="dark" />

        <View className="px-[6%] pt-[12%] pb-[7%] bg-white rounded-b-3xl shadow-sm">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-4xl font-extrabold text-gray-900 tracking-tight">
                TaskFlow
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Stay organized and productive
              </Text>
            </View>

            <Image
              source={{
                uri: "https://avatars.githubusercontent.com/u/123292825?v=4&size=64",
              }}
              className="w-14 h-14 rounded-full border-2"
              resizeMode="cover"
            />
          </View>

          <View className="flex-row justify-between mt-8 bg-gray-50 rounded-3xl py-5 px-3 border border-gray-100">
            <View className="items-center flex-1">
              <Text className="text-2xl font-extrabold text-blue-600">
                {tasks.length}
              </Text>
              <Text className="text-xs text-gray-500 uppercase font-semibold mt-1">
                Total
              </Text>
            </View>

            <View className="items-center flex-1 border-x border-gray-200">
              <Text className="text-2xl font-extrabold text-green-500">
                {tasks.filter((t) => t.completed).length}
              </Text>
              <Text className="text-xs text-gray-500 uppercase font-semibold mt-1">
                Done
              </Text>
            </View>

            <View className="items-center flex-1">
              <Text className="text-2xl font-extrabold text-orange-500">
                {tasks.filter((t) => !t.completed).length}
              </Text>
              <Text className="text-xs text-gray-500 uppercase font-semibold mt-1">
                Pending
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row px-[5%] py-4 bg-gray-100 gap-3">
          <Pressable
            onPress={markAllDone}
            className="flex-1 bg-blue-600 py-4 rounded-2xl items-center shadow-sm active:opacity-80"
          >
            <Text className="text-white font-semibold text-sm">
              Mark All Done
            </Text>
          </Pressable>

          <Pressable
            onPress={clearCompleted}
            className="flex-1 bg-red-500 py-4 rounded-2xl items-center shadow-sm active:opacity-80"
          >
            <Text className="text-white font-semibold text-sm">
              Clear Completed
            </Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-[5%] mt-5"
          contentContainerStyle={{ paddingBottom: "30%" }}
          showsVerticalScrollIndicator={false}
        >
          {tasks.length > 0 ? (
            tasks.map((task, i) => (
              <View
                key={i}
                className={`flex-row items-center p-4 rounded-3xl mb-4 border ${
                  task.completed
                    ? "bg-green-50 border-green-100"
                    : "bg-white border-gray-100"
                } shadow-sm`}
              >
                <Pressable
                  onPress={() => toggleTask(i)}
                  className="flex-row items-center flex-1"
                >
                  <View
                    className={`w-8 h-8 rounded-2xl border-2 items-center justify-center ${
                      task.completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {task.completed && (
                      <Text className="text-white text-sm font-bold">✓</Text>
                    )}
                  </View>

                  <View className="flex-1 ml-4">
                    <Text
                      className={`text-base font-semibold ${
                        task.completed
                          ? "text-gray-400 line-through opacity-70"
                          : "text-gray-800"
                      }`}
                      numberOfLines={2}
                    >
                      {task.title}
                    </Text>

                    <Text
                      className={`text-xs mt-1 ${
                        task.completed ? "text-green-500" : "text-orange-400"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => deleteTask(i)}
                  className="bg-red-50 p-3 rounded-2xl ml-3 active:opacity-70"
                >
                  <Text className="text-red-500 text-lg">🗑️</Text>
                </Pressable>
              </View>
            ))
          ) : (
            <View className="items-center justify-center mt-24 px-6">
              <View className="bg-white rounded-3xl p-10 w-full items-center shadow-sm border border-gray-100">
                <Text className="text-7xl mb-5">📝</Text>

                <Text className="text-2xl font-bold text-gray-700">
                  No tasks yet!
                </Text>

                <Text className="text-gray-400 text-center mt-3 leading-6">
                  Stay productive by adding your first task below and start
                  organizing your day.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View className="p-[5%] bg-white border-t border-gray-200">
          <View className="flex-row items-center bg-gray-100 rounded-3xl px-4 py-3 border border-gray-200">
            <TextInput
              placeholder="Add a new task..."
              placeholderTextColor="#9ca3af"
              className="flex-1 text-gray-800 text-base"
              value={newTask}
              onChangeText={setNewTask}
            />

            <Pressable
              onPress={addTask}
              disabled={newTask.trim() === ""}
              className={`w-12 h-12 rounded-2xl items-center justify-center ml-3 ${
                newTask.trim() === "" ? "bg-gray-300" : "bg-blue-600"
              }`}
            >
              <Text className="text-white text-2xl font-bold">+</Text>
            </Pressable>
          </View>

          {newTask.trim() === "" && (
            <Text className="text-xs text-gray-400 mt-2 text-center">
              Write something to add a task
            </Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
