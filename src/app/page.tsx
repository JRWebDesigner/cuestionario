"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveResponses } from "../lib/saveResponses"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

export default function Questionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [isComplete, setIsComplete] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender:''
  });
  const [showQuestions, setShowQuestions] = useState(false);
  const [showConsent, setShowConsent] = useState(true); // Nuevo estado para controlar la modal de consentimiento

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(answers[currentQuestion + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1]);
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    saveResponses(
      answers,
      userData.name,
      parseInt(userData.age),
      userData.gender
    );
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setAnswers(Array(questions.length).fill(null));
    setIsComplete(false);
    setShowQuestions(false);
    setUserData({ name: '', age: '', gender:'' });
  };
  
  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.name && userData.age) {
      setShowQuestions(true);
    }
  }

  const handleAcceptConsent = () => {
    setShowConsent(false);
  };

  if (showConsent) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-6 rounded-xl shadow-xl border border-indigo-300 max-w-md w-[90%] h-[90dvh] overflow-y-auto"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-indigo-800">Consentimiento Informado</h3>
          </div>
          <div className="space-y-4 text-sm text-gray-800">
            <p><strong>Título:</strong> "Asesoramiento virtual como medio de prevención de embarazo en la comunidad estudiantil de la Universidad Privada Franz Tamayo 2025"</p>
            <p><strong>Contenido:</strong> El cuestionario cuenta con 20 preguntas entre selección múltiple y de respuesta abierta cuya finalidad del presente trabajo de investigación es identificar las causas del embarazo en la comunidad estudiantil universitario.</p>
            <p><strong>AUTORES:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>Boyan Mendieta Rossely Keiko</li>
              <li>Chejo Merlo Wilmer Reynaldo</li>
              <li>Julliri Pinto Maribel</li>
              <li>Murillo Amaru Ruth Karina</li>
              <li>Paye Vilca Wilson Tito</li>
              <li>Ríos Ordoñez Fernando Javier</li>
              <li>Surco Cuaquira Melanni Belen</li>
              <li>Torrez Tupa Coraima</li>
            </ul>
            <p><strong>Descripción del estudio:</strong> El propósito este estudio es determinar las causas que predisponen el embarazo en la comunidad estudiantil universitaria. El cuestionario está diseñado para recopilar información sobre los factores que predisponen el embarazo en la comunidad estudiantil y su participación contribuirá a mejorar el conocimiento en esta aérea</p>
            <p><strong>Procedimiento:</strong> Se le solicitará que complete un cuestionario de – preguntas. Las cuales están relacionadas con información sobre los datos demográficos y como usted evita el embarazo perteneciendo a la comunidad universitaria.</p>
            <p><strong>Participación voluntaria:</strong> Su participación es completamente voluntaria. Usted es libre de decidir si desea o no participar en esta investigación. Si en cualquier momento durante la investigación decide retirarse, puede hacerlo sin dar ninguna explicación ni sufrir ninguna penalización. Además, puede dejar de participar incluso después de realizar la encuesta.</p>
            <p><strong>Confidencialidad:</strong> Toda la información que proporcione será tratada de manera confidencial. Sus respuestas serán anónimas y será utilizadas de manera que pueden identificarlo/a. Los datos recopilados se utilizarán únicamente para fines de investigación y serán procesados de forma estadística.</p>
            <p><strong>Riesgos y beneficios:</strong> Usted no corre riesgo de esta investigación ya que solo se obtendrá la información proporcionada por su persona. Aunque no recibirá beneficios directos por su participación, su colaboración contribuirá al avance en el conocimiento acerca del embarazo en la comunidad universitaria.</p>
            <p><strong>Contacto para preguntas:</strong> Si tiene alguna pregunta sobre este estudio o sobre sus derechos como participantes, puede contactarse con los autores.</p>
          </div>
          <button
            onClick={handleAcceptConsent}
            className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Aceptar y continuar
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!showQuestions) {
    return(
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 p-8"
        >
          <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">Antes de comenzar...</h1>
          
          <form onSubmit={startQuiz} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Codigo de estudiante
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleUserDataChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingresa tu nombre"
              />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Edad
              </label>
              <input 
                type="number"
                id="age"
                name="age"
                value={userData.age}
                onChange={handleUserDataChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingresa tu edad"
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Sexo
              </label>
              <select
                id="gender"
                name="gender"
                value={userData.gender}
                onChange={handleUserDataChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Selecciona tu sexo</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
              </select>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={!userData.name || !userData.age}
                className={`w-full px-6 py-3 rounded-lg font-medium text-white ${
                  !userData.name || !userData.age
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Comenzar cuestionario
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return(
     <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">Cuestionario sobre Métodos Anticonceptivos</h1>
          <p className="text-gray-600">Usuario: {userData.name} - Edad: {userData.age} años</p>
        </motion.div>

        {!isComplete ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100"
          >
            {questions[currentQuestion].category && (
              <div className="bg-indigo-600 px-6 py-3">
                <h2 className="text-white font-semibold text-lg">
                  {questions[currentQuestion].category}
                </h2>
              </div>
            )}
            
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-indigo-600 font-medium">
                  Pregunta {currentQuestion + 1} de {questions.length}
                </span>
                <div className="w-full bg-gray-200 rounded-full h-2.5 ml-4">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 mb-8">
                {questions[currentQuestion].text}
              </h3>

              <div className="space-y-4 mb-10">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === index
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          selectedOption === index
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-400'
                        }`}
                      >
                        {selectedOption === index && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    currentQuestion === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  Anterior
                </button>
                
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      selectedOption === null
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    disabled={selectedOption === null}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      selectedOption === null
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Finalizar
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 p-8 text-center"
          >
            <div className="mb-8">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Gracias por completar el cuestionario!</h2>
              <p className="text-gray-600 mb-6">
                Tu participación es valiosa para nosotros. Esperamos que esta experiencia haya sido informativa y útil.
              </p>
              <p className="text-indigo-600 font-medium">
                Recuerda consultar siempre con un profesional de la salud para asesoramiento personalizado.
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Reiniciar cuestionario
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
