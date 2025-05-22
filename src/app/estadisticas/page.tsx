"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, writeBatch } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Timestamp } from "firebase/firestore";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
  LineChart, Line, Legend, PieChart, Pie, Cell
} from "recharts";
import { PieLabelRenderProps } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import * as XLSX from 'xlsx';

interface ResponseData {
  id: string;
  answers: number[];
  timestamp: Timestamp;
  userId?: string;
  userName: string;
  userAge: number;
  userGender: string;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  category?: string;
}

const questions: Question[] = [
   {
    id: 1,
    text: "Los métodos anticonceptivos son:",
    options: [
      "Sustancias que impiden que nazca el bebé",
      "Sustancias y/o procedimientos que impiden el embarazo",
      "Sustancias que causan daño a la mujer",
      "Ninguna de las anteriores"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    text: "Los métodos anticonceptivos pueden ser usados por:",
    options: [
      "Solo el hombre",
      "La pareja",
      "Solo la mujer",
      "Ninguna de las anteriores"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "Los métodos de uso anticonceptivos para mujeres son:",
    options: [
      "Condón, coito interrumpido, vasectomía",
      "Píldora, método del ritmo, T de cobre",
      "Condón, píldora, T de cobre",
      "Ninguna de las anteriores"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    text: "Los métodos de uso anticonceptivos para los hombres son:",
    options: [
      "Condón, coito interrumpido, vasectomía",
      "Píldora, métodos del ritmo, T de cobre",
      "Condón, píldora, T de cobre",
      "Ninguna de las anteriores"
    ],
    correctAnswer: 0
  },
  {
    id: 5,
    text: "Según los siguientes métodos, ¿cuáles requieren supervisión médica?",
    options: [
      "Píldora, inyecciones, T de cobre",
      "Método del ritmo, coito interrumpido",
      "Diafragma",
      "Todas las anteriores",
      "Ninguna de las anteriores"
    ],
    correctAnswer: 3
  },
  {
    id: 6,
    text: "¿Cuáles son los métodos de barrera?",
    options: [
      "Método de calendario (ritmo)",
      "T de cobre (dispositivo intrauterino)",
      "Píldoras o inyecciones",
      "Ligadura de trompas – vasectomía",
      "Condón (preservativo) – Diafragma"
    ],
    correctAnswer: 4
  },
  {
    id: 7,
    text: "¿En qué momento se debe colocar el condón (preservativo)?",
    options: [
      "Antes de la penetración",
      "Durante la penetración",
      "Antes de la eyaculación",
      "A y B",
      "Ninguna de las anteriores"
    ],
    correctAnswer: 0
  },
  {
    id: 8,
    text: "¿Tiene efectos secundarios los Métodos de Barrera?",
    options: [
      "Sí",
      "No",
      "A veces",
      "Ninguna de las anteriores"
    ],
    correctAnswer: 2
  },
  {
    id: 9,
    text: "¿Cuáles son los métodos naturales?",
    options: [
      "Ritmo",
      "Diafragma",
      "Método Billings o Moco cervical",
      "Condón",
      "A y C"
    ],
    correctAnswer: 4
  },
  {
    id: 10,
    text: "¿Quiénes pueden utilizar el método del ritmo?",
    options: [
      "Todas las mujeres sexualmente activas",
      "Mujeres con ciclo menstrual irregular",
      "Mujeres con ciclo menstrual regular",
      "Todas las anteriores",
      "Ninguna de las anteriores"
    ],
    correctAnswer: 2
  },
  {
    id: 11,
    text: "¿La presencia del moco cervical son los días?",
    options: [
      "Inicio del ciclo menstrual",
      "Mediados del ciclo menstrual",
      "Inicio de la menstruación",
      "Término de la menstruación",
      "Ninguna de las anteriores"
    ],
    correctAnswer: 1
  },
  {
    id: 12,
    text: "¿El método del ritmo consiste en tener relaciones los días?",
    options: [
      "Los días fértiles",
      "Los días infértiles",
      "Todos los días",
      "Ninguna de las anteriores"
    ],
    correctAnswer: 1
  },
  {
    id: 13,
    text: "¿Cuáles son los métodos hormonales?",
    options: [
      "Condón y diafragma",
      "Píldoras y diafragma",
      "Diafragma e inyectable",
      "Inyectables y píldoras",
      "Ninguna de las anteriores"
    ],
    correctAnswer: 3
  },
  {
    id: 14,
    text: "¿Los efectos secundarios más conocidos son?",
    options: [
      "Dolor de cabeza y suspensión del ciclo menstrual",
      "Subida de peso y dolor de cabeza",
      "Cambios en el ánimo",
      "B y C",
      "Todas las anteriores"
    ],
    correctAnswer: 4
  },
  {
    id: 15,
    text: "¿Los métodos hormonales evitan?",
    options: [
      "Infección de transmisión sexual",
      "La menstruación",
      "La fecundación",
      "La ovulación",
      "Ninguna de las anteriores"
    ],
    correctAnswer: 3
  },
  {
    id: 16,
    text: "¿Los inyectables se usan?",
    options: [
      "Cada mes",
      "Cada 6 meses",
      "Cada 3 meses",
      "A y B",
      "A y C"
    ],
    correctAnswer: 4
  },
  {
    id: 17,
    text: "¿Los métodos quirúrgicos son?",
    options: [
      "Métodos de Billings",
      "Ligadura de trompas",
      "Vasectomía",
      "A y B",
      "B y C"
    ],
    correctAnswer: 4
  },
  {
    id: 18,
    text: "¿La vasectomía es?",
    options: [
      "Método quirúrgico parcial",
      "Método quirúrgico definitivo",
      "Eliminación de los espermatozoides",
      "Cierre de los conductos seminales",
      "Ninguna de las anteriores"
    ],
    correctAnswer: 1
  },
  {
    id: 19,
    text: "¿La intervención quirúrgica de ligadura de trompas consiste en?",
    options: [
      "Atar las trompas de Falopio",
      "Cortar las trompas de Falopio",
      "Obstruir las trompas de Falopio",
      "A y C",
      "B y C"
    ],
    correctAnswer: 4
  },
  {
    id: 20,
    text: "La vasectomía es efectiva a partir de los:",
    options: [
      "7 días",
      "1 semana",
      "2 semanas",
      "3 meses",
      "6 meses"
    ],
    correctAnswer: 3
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function StatsDashboard() {
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const q = query(collection(db, "responses"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ResponseData[];
        setResponses(data);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  // Estadísticas generales
  const generalStats = responses.reduce((acc, response) => {
    response.answers.forEach((answer, i) => {
      if (answer !== null) {
        if (!acc[i]) acc[i] = { correct: 0, total: 0 };
        acc[i].total++;
        if (answer === questions[i].correctAnswer) {
          acc[i].correct++;
        }
      }
    });
    return acc;
  }, [] as { correct: number; total: number }[]);

  const generalChartData = questions.map((q, i) => ({
    name: `P${i + 1}`,
    correctRate: generalStats[i]?.total ? (generalStats[i].correct / generalStats[i].total) * 100 : 0,
    questionText: q.text
  }));

  // Estadísticas por fecha
  const dateStats = responses.reduce((acc, response) => {
    const date = format(new Date(response.timestamp?.seconds * 1000), 'yyyy-MM-dd', { locale: es });
    if (!acc[date]) acc[date] = { correct: 0, total: 0, count: 0 };
    
    const correctAnswers = response.answers.reduce((sum, answer, i) => {
      if (answer !== null) {
        acc[date].total++;
        if (answer === questions[i].correctAnswer) {
          return sum + 1;
        }
      }
      return sum;
    }, 0);
    
    acc[date].correct += correctAnswers;
    acc[date].count++;
    return acc;
  }, {} as Record<string, { correct: number; total: number; count: number }>);

  const dateChartData = Object.entries(dateStats).map(([date, stats]) => ({
    date,
    correctRate: stats.total ? (stats.correct / stats.total) * 100 : 0,
    averageScore: stats.count ? (stats.correct / (stats.count * questions.length)) * 100 : 0,
    responses: stats.count
  }));

  // Estadísticas por género
  const genderStats = responses.reduce((acc, response) => {
    const gender = response.userGender || 'No especificado';
    
    if (!acc[gender]) {
      acc[gender] = {
        correct: 0,
        total: 0,
        count: 0,
        users: new Set<string>()
      };
    }

    if (response.userId) {
      acc[gender].users.add(response.userId);
    }

    const correctAnswers = response.answers.reduce((sum, answer, i) => {
      if (answer !== null && questions[i]) {
        acc[gender].total++;
        if (answer === questions[i].correctAnswer) {
          return sum + 1;
        }
      }
      return sum;
    }, 0);

    acc[gender].correct += correctAnswers;
    acc[gender].count++;

    return acc;
  }, {} as Record<string, {
    correct: number;
    total: number;
    count: number;
    users: Set<string>;
  }>);

  const genderChartData = Object.entries(genderStats).map(([gender, stats]) => ({
    gender,
    correctRate: stats.total ? (stats.correct / stats.total) * 100 : 0,
    averageScore: stats.count ? (stats.correct / (stats.count * questions.length)) * 100 : 0,
    responses: stats.count,
    users: stats.users.size
  }));

  // Estadísticas por usuario
  const userStats = responses.reduce((acc, response) => {
    const userId = response.userId || "anonymous";
    const userName = response.userName || `Usuario ${userId.slice(0, 6)}`;
    
    if (!acc[userId]) {
      acc[userId] = {
        name: userName,
        age: response.userAge,
        gender: response.userGender || 'No especificado',
        correct: 0,
        total: 0,
        count: 0,
        lastResponse: response.timestamp as Timestamp
      };
    }
    
    const correctAnswers = response.answers.reduce((sum, answer, i) => {
      if (answer !== null && questions[i]) {
        acc[userId].total++;
        if (answer === questions[i].correctAnswer) {
          return sum + 1;
        }
      }
      return sum;
    }, 0);
    
    acc[userId].correct += correctAnswers;
    acc[userId].count++;
    if (response.timestamp > acc[userId].lastResponse) {
      acc[userId].lastResponse = response.timestamp;
    }
    
    return acc;
  }, {} as Record<string, { 
    name: string; 
    age: number;
    gender: string;
    correct: number; 
    total: number; 
    count: number; 
    lastResponse: Timestamp 
  }>);

  const userChartData = Object.entries(userStats).map(([userId, stats]) => ({
    userId,
    name: stats.name,
    age: stats.age,
    gender: stats.gender,
    correctRate: stats.total ? (stats.correct / stats.total) * 100 : 0,
    averageScore: stats.count ? (stats.correct / (stats.count * questions.length)) * 100 : 0,
    responses: stats.count,
    lastResponse: format(new Date(stats.lastResponse?.seconds * 1000), 'PPpp', { locale: es })
  }));

  // Estadísticas por categoría
  const categoryStats = questions.reduce((acc, question) => {
    const category = question.category || "General";
    if (!acc[category]) acc[category] = { correct: 0, total: 0 };
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  responses.forEach(response => {
    response.answers.forEach((answer, i) => {
      if (answer !== null) {
        const category = questions[i].category || "General";
        categoryStats[category].total++;
        if (answer === questions[i].correctAnswer) {
          categoryStats[category].correct++;
        }
      }
    });
  });

  const categoryChartData = Object.entries(categoryStats).map(([name, stats]) => ({
    name,
    value: stats.total ? (stats.correct / stats.total) * 100 : 0,
    count: stats.total
  }));

  // Estadísticas por edad
  const ageStats = responses.reduce((acc, response) => {
  const age = response.userAge; // Usamos la edad exacta ahora
  const gender = response.userGender || 'No especificado';
  
  if (!acc[age]) {
    acc[age] = {
      correct: 0,
      total: 0,
      count: 0,
      users: new Set<string>(),
      genders: {} as Record<string, number>
    };
  }

    if (!acc[age].genders[gender]) {
      acc[age].genders[gender] = 0;
    }
    acc[age].genders[gender]++;

    if (response.userId) {
      acc[age].users.add(response.userId);
    }

    const correctAnswers = response.answers.reduce((sum, answer, i) => {
      if (answer !== null && questions[i]) {
        acc[age].total++;
        if (answer === questions[i].correctAnswer) {
          return sum + 1;
        }
      }
      return sum;
    }, 0);

    acc[age].correct += correctAnswers;
    acc[age].count++;

    return acc;
  }, {} as Record<number, {
  correct: number;
  total: number;
  count: number;
  users: Set<string>;
  genders: Record<string, number>;
  }>);

  const ageChartData = Object.entries(ageStats)
  .map(([age, stats]) => ({
    age: `${age} años`, // Mostrar edad exacta
    rawAge: parseInt(age),
    correctRate: stats.total ? (stats.correct / stats.total) * 100 : 0,
    averageScore: stats.count ? (stats.correct / (stats.count * questions.length)) * 100 : 0,
    responses: stats.count,
    users: stats.users.size,
    genders: stats.genders
  }))
  .sort((a, b) => a.rawAge - b.rawAge); 
  // Exportar a Excel
  const exportToExcel = () => {
    // Hoja 1: Respuestas detalladas
    const responsesSheet = responses.map((response, idx) => {
      const answersFormatted = response.answers.map((answer, i) => {
        if (answer === null) return 'Sin responder';
        const isCorrect = answer === questions[i].correctAnswer;
        return `${answer + 1} (${isCorrect ? '✔' : '✘'})`;
      });

      const correctAnswers = response.answers.reduce((sum, answer, i) => {
        return answer === questions[i].correctAnswer ? sum + 1 : sum;
      }, 0);
      
      const percentage = (correctAnswers / questions.length * 100).toFixed(1);

      return {
        "ID": idx + 1,
        "Usuario": response.userName,
        "Edad": response.userAge,
        "Género": response.userGender || 'No especificado',
        "Fecha": format(new Date(response.timestamp?.seconds * 1000), 'dd/MM/yyyy HH:mm', { locale: es }),
        "Puntaje Total": `${correctAnswers}/${questions.length}`,
        "Porcentaje": `${percentage}%`,
        ...questions.reduce((acc, q, i) => {
          acc[`P${i + 1}`] = answersFormatted[i];
          return acc;
        }, {} as Record<string, string>)
      };
    });

    // Hoja 2: Resumen por edad
    const ageSummarySheet = ageChartData.map(age => ({
  "Edad": age.rawAge, // Mostramos el número de edad directamente (ej: 22 en vez de "22 años")
  "Usuarios Únicos": age.users,
  "Total Respuestas": age.responses,
  "Porcentaje de Aciertos": `${age.correctRate.toFixed(1)}%`,
  "Puntaje Promedio": `${age.averageScore.toFixed(1)}%`,
  "Nivel de Desempeño": getPerformanceLevel(age.averageScore),
  "Detalle por Género": Object.entries(age.genders)
    .map(([gender, count]) => `${gender}: ${count}`)
    .join(", ")
}));

    // Hoja 3: Resumen por pregunta
    const questionsSheet = questions.map((q, i) => {
      const total = generalStats[i]?.total || 0;
      const correct = generalStats[i]?.correct || 0;
      const percentage = total ? ((correct / total) * 100).toFixed(1) : '0';

      return {
        "ID Pregunta": `P${i + 1}`,
        "Categoría": q.category || "General",
        "Texto Pregunta": q.text,
        "Respuesta Correcta": q.options[q.correctAnswer],
        "Total Respuestas": total,
        "Aciertos": correct,
        "Porcentaje Acierto": `${percentage}%`,
        "Dificultad": getDifficultyLevel(correct, total)
      };
    });

    // Hoja 4: Resumen por usuario
    const usersSheet = userChartData.map(user => ({
      "ID Usuario": user.userId,
      "Nombre": user.name,
      "Edad": user.age,
      "Género": user.gender,
      "Total Respuestas": user.responses,
      "Puntaje Promedio": `${user.averageScore.toFixed(1)}%`,
      "Última Participación": user.lastResponse,
      "Nivel de Desempeño": getPerformanceLevel(user.averageScore)
    }));

    // Hoja 5: Resumen por género
    const genderSummarySheet = genderChartData.map(gender => ({
      "Género": gender.gender,
      "Usuarios Únicos": gender.users,
      "Total Respuestas": gender.responses,
      "Preguntas Correctas": `${gender.correctRate.toFixed(1)}%`,
      "Puntaje Promedio": `${gender.averageScore.toFixed(1)}%`
    }));

    // Función auxiliar para determinar nivel de desempeño
    function getPerformanceLevel(score: number): string {
      if (score >= 85) return "Excelente";
      if (score >= 70) return "Bueno";
      if (score >= 50) return "Regular";
      return "Necesita mejorar";
    }

    // Función auxiliar para determinar dificultad
    function getDifficultyLevel(correct: number, total: number): string {
      if (total === 0) return "Sin datos";
      const percentage = (correct / total) * 100;
      if (percentage >= 70) return "Fácil";
      if (percentage >= 40) return "Moderada";
      return "Difícil";
    }

    // Crear libro Excel
    const wb = XLSX.utils.book_new();
    
    // Añadir hojas
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(responsesSheet), "Respuestas");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ageSummarySheet), "Por Edad");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(genderSummarySheet), "Por Género");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(questionsSheet), "Preguntas");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(usersSheet), "Usuarios");

    // Generar el archivo Excel
    XLSX.writeFile(wb, `Estadisticas_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  // Reiniciar estadísticas
  const resetStatistics = async () => {
    if (!confirm("¿Estás seguro que deseas borrar todas las estadísticas? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsResetting(true);
    try {
      const batch = writeBatch(db);
      const responsesRef = collection(db, "responses");
      const snapshot = await getDocs(responsesRef);
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      setResponses([]);
      alert("Todas las estadísticas han sido borradas correctamente.");
    } catch (error) {
      console.error("Error al borrar estadísticas:", error);
      alert("Ocurrió un error al borrar las estadísticas.");
    } finally {
      setIsResetting(false);
    }
  };

  // Componente de información demográfica
  const DemographicInfo = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 text-indigo-700">Información Demográfica</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gráfico de distribución por edad */}
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Distribución por Edad</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageChartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis 
    dataKey="age"
    label={{ value: 'Edad', position: 'insideBottomRight', offset: -5 }}
  />
  <YAxis 
    label={{ value: 'Cantidad', angle: -90, position: 'insideLeft' }}
  />
                <Tooltip 
                  formatter={(value: number, name: string) => 
                    name === 'users' 
                      ? [`${value} usuarios`, "Usuarios únicos"]
                      : [`${value}`, name]
                  }
                />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" name="Usuarios únicos" />
                <Bar dataKey="responses" fill="#82ca9d" name="Respuestas totales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Gráfico de distribución por género */}
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Distribución por Género</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="users"
                  nameKey="gender"
                  label={(entry) => `${entry.gender}: ${entry.users}`}
                >
                  {genderChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [
                  `${value} usuarios (${((value as number / responses.length) * 100).toFixed(1)}%)`,
                  props.payload.gender
                ]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Gráfico de rendimiento por género */}
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Rendimiento por Género</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gender" />
                <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, "Porcentaje"]} />
                <Legend />
                <Bar dataKey="correctRate" fill="#6366f1" name="Aciertos" />
                <Bar dataKey="averageScore" fill="#82ca9d" name="Puntaje promedio" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Tabla de datos por edad y género */}
      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-3">Detalle por Edad y Género</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Género</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuarios</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respuestas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aciertos</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ageChartData.flatMap(ageData => 
                Object.entries(ageData.genders).map(([gender, count], i) => (
                  <tr key={`${ageData.rawAge}-${gender}-${i}`}>
                    <td className="px-6 py-4 whitespace-nowrap">{ageData.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{count}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ageData.responses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ageData.correctRate.toFixed(1)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className='block md:sticky top-0 z-50 bg-white/80 backdrop-blur-md py-4 mb-12 border-b border-indigo-200 shadow-sm'>
        <nav className='flex flex-wrap justify-center gap-4'>
          <Link className='px-4 py-2 rounded-lg transition font-semibold bg-indigo-100 hover:bg-indigo-200 text-indigo-800' href='/'>Inicio</Link>
          <Link className='px-4 py-2 rounded-lg transition font-semibold bg-indigo-100 hover:bg-indigo-200 text-indigo-800' href='/cuestionario'>Cuestionario</Link>
          <Link className='px-4 py-2 rounded-lg transition font-semibold bg-indigo-100 hover:bg-indigo-200 text-indigo-800' href='/estadisticas'>Estadísticas</Link>
        </nav>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-800">Dashboard de Estadísticas</h1>
          <div className="flex gap-2">
            <button 
              onClick={exportToExcel}
              disabled={responses.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Exportar a Excel
            </button>
            <button 
              onClick={resetStatistics}
              disabled={isResetting || responses.length === 0}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              {isResetting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Borrando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Reiniciar Estadísticas
                </>
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando datos...</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">No hay datos disponibles todavía</p>
          </div>
        ) : (
          <>
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
              <button
                className={`px-4 py-2 font-medium ${activeTab === "general" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("general")}
              >
                Resumen General
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === "users" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("users")}
              >
                Por Usuario
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === "dates" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("dates")}
              >
                Por Fecha
              </button>
            </div>

            {activeTab === "general" && (
              <div className="space-y-8">
                <DemographicInfo />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-700">Porcentaje de aciertos por pregunta</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={generalChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                          <Tooltip 
                            formatter={(val: number) => [`${val.toFixed(1)}%`, "Porcentaje de acierto"]}
                            labelFormatter={(label) => `Pregunta ${label}`}
                          />
                          <Bar dataKey="correctRate" fill="#6366f1">
                            <LabelList 
                              dataKey="correctRate" 
                              position="top" 
                              formatter={(val: number) => `${val.toFixed(1)}%`} 
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-700">Aciertos por categoría</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={(props: PieLabelRenderProps) =>
                              props.percent !== undefined
                                ? `${props.name}: ${(props.percent * 100).toFixed(0)}%`
                                : props.name || ""
                            }
                          >
                            {categoryChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, "Porcentaje de acierto"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4 text-indigo-700">Detalle de preguntas</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pregunta</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Texto</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aciertos</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porcentaje</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {generalChartData.map((data, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">P{i + 1}</td>
                            <td className="px-6 py-4 whitespace-normal max-w-xs">{questions[i].text}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{generalStats[i]?.correct || 0} / {generalStats[i]?.total || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{data.correctRate.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-700">Rendimiento por usuario</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={userChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                          <Tooltip 
                            formatter={(val: number) => [`${val.toFixed(1)}%`, "Porcentaje de acierto"]}
                            labelFormatter={(label) => `Usuario: ${label}`}
                          />
                          <Legend />
                          <Bar dataKey="correctRate" fill="#6366f1" name="Aciertos por pregunta" />
                          <Bar dataKey="averageScore" fill="#82ca9d" name="Puntaje promedio" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-700">Lista de Usuarios</h2>
                    <div className="max-h-80 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Género</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntaje</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última respuesta</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {userChartData.map((user, i) => (
                            <tr 
                              key={i} 
                              className={`cursor-pointer hover:bg-indigo-50 ${selectedUser === user.userId ? "bg-indigo-100" : ""}`}
                              onClick={() => setSelectedUser(user.userId)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{formatAge(user.age)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{user.gender}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{user.averageScore.toFixed(1)}%</td>
                              <td className="px-6 py-4 whitespace-nowrap">{user.lastResponse}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {selectedUser && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-700">
                      Detalle de respuestas para {userStats[selectedUser]?.name}
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntaje</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {responses
                            .filter(r => r.userId === selectedUser)
                            .map((response, i) => {
                              const correctCount = response.answers.reduce((sum, answer, i) => {
                                return answer === questions[i].correctAnswer ? sum + 1 : sum;
                              }, 0);
                              const score = (correctCount / questions.length) * 100;
                              const date = format(new Date(response.timestamp?.seconds * 1000), 'PPpp', { locale: es });

                              return (
                                <tr key={i}>
                                  <td className="px-6 py-4 whitespace-nowrap">{date}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">{score.toFixed(1)}%</td>
                                  <td className="px-6 py-4 whitespace-normal">
                                    <div className="flex flex-wrap gap-1">
                                      {response.answers.map((answer, j) => (
                                        <span 
                                          key={j}
                                          className={`inline-block w-6 h-6 rounded-full text-xs flex items-center justify-center ${
                                            answer === questions[j].correctAnswer 
                                              ? "bg-green-100 text-green-800" 
                                              : answer === null 
                                                ? "bg-gray-100 text-gray-800" 
                                                : "bg-red-100 text-red-800"
                                          }`}
                                          title={`P${j + 1}: ${questions[j].text}`}
                                        >
                                          {j + 1}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "dates" && (
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4 text-indigo-700">Rendimiento por fecha</h2>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dateChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                        <Tooltip 
                          formatter={(val: number) => [`${val.toFixed(1)}%`, "Porcentaje de acierto"]}
                          labelFormatter={(label) => `Fecha: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="correctRate" 
                          stroke="#6366f1" 
                          name="Aciertos por pregunta" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="averageScore" 
                          stroke="#82ca9d" 
                          name="Puntaje promedio" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4 text-indigo-700">Detalle por fecha</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respuestas</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aciertos por pregunta</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntaje promedio</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dateChartData.map((data, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4 whitespace-nowrap">{data.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{data.responses}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{data.correctRate.toFixed(1)}%</td>
                            <td className="px-6 py-4 whitespace-nowrap">{data.averageScore.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
