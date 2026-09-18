'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Trophy, Clock, Target } from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number // index of correct answer
  difficulty: 'easy' | 'medium' | 'hard'
}

const DARTBOARD_SCORES = {
  bullseye: 50,      // Correct on first try
  innerBull: 25,     // Correct on second try
  triple: 20,        // Correct on third try
  double: 10,        // Correct on fourth try
  single: 5,         // Correct on last try
}

export default function CheckoutGame() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [startTime] = useState(Date.now())
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project')) {
      import('@/lib/supabase/client').then(({ createClient }) => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
          setUser(user)
        })
      })
    }

    // Load daily challenge
    loadDailyChallenge()
  }, [])

  const loadDailyChallenge = async () => {
    try {
      const response = await fetch('/api/daily-challenge?game=checkout')

      if (response.ok) {
        const dailyChallenge = await response.json()
        setQuestions(dailyChallenge.data.questions || [])
        return
      }
    } catch (error) {
      console.log('No daily challenge, using demo data')
    }

    // Fallback to demo questions
    const demoQuestions: Question[] = [
      {
        id: '1',
        question: 'Which country won the 2018 FIFA World Cup?',
        options: ['Brazil', 'France', 'Germany', 'Argentina'],
        correctAnswer: 1,
        difficulty: 'easy',
      },
      {
        id: '2',
        question: 'Who is the all-time top scorer in Premier League history?',
        options: ['Wayne Rooney', 'Alan Shearer', 'Sergio Agüero', 'Thierry Henry'],
        correctAnswer: 1,
        difficulty: 'medium',
      },
      {
        id: '3',
        question: 'Which club has won the most UEFA Champions League titles?',
        options: ['Barcelona', 'AC Milan', 'Real Madrid', 'Bayern Munich'],
        correctAnswer: 2,
        difficulty: 'easy',
      },
      {
        id: '4',
        question: 'In which year did Leicester City win the Premier League?',
        options: ['2014', '2015', '2016', '2017'],
        correctAnswer: 2,
        difficulty: 'medium',
      },
      {
        id: '5',
        question: 'Who scored the "Hand of God" goal in 1986?',
        options: ['Pelé', 'Diego Maradona', 'Johan Cruyff', 'Michel Platini'],
        correctAnswer: 1,
        difficulty: 'easy',
      },
    ]

    setQuestions(demoQuestions)
  }

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || isComplete) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerActive, isComplete, currentQuestion])

  const handleTimeout = () => {
    // Move to next question on timeout
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAttempts(0)
      setTimeLeft(30)
    } else {
      finishGame()
    }
  }

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const question = questions[currentQuestion]
    const isCorrect = selectedAnswer === question.correctAnswer

    if (isCorrect) {
      // Calculate dartboard score based on attempts
      let questionScore = 0
      if (attempts === 0) questionScore = DARTBOARD_SCORES.bullseye
      else if (attempts === 1) questionScore = DARTBOARD_SCORES.innerBull
      else if (attempts === 2) questionScore = DARTBOARD_SCORES.triple
      else if (attempts === 3) questionScore = DARTBOARD_SCORES.double
      else questionScore = DARTBOARD_SCORES.single

      setScore(score + questionScore)
      setAnsweredQuestions([...answeredQuestions, currentQuestion])

      // Move to next question
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setSelectedAnswer(null)
          setAttempts(0)
          setTimeLeft(30)
        } else {
          finishGame()
        }
      }, 1000)
    } else {
      // Wrong answer - allow retry
      setAttempts(attempts + 1)
      setSelectedAnswer(null)

      // If max attempts reached, move to next question
      if (attempts >= 4) {
        setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedAnswer(null)
            setAttempts(0)
            setTimeLeft(30)
          } else {
            finishGame()
          }
        }, 1000)
      }
    }
  }

  const finishGame = () => {
    setIsComplete(true)
    setIsTimerActive(false)

    // Save score if logged in
    if (user) {
      saveScore()
    }
  }

  const saveScore = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      await supabase.from('game_attempts').insert({
        user_id: user.id,
        game_type_id: '3', // Checkout game type
        score: score,
        completed: true,
        time_taken: Math.floor((Date.now() - startTime) / 1000),
        attempt_data: {
          questions_answered: answeredQuestions.length,
          total_questions: questions.length,
        },
      })
    } catch (error) {
      console.error('Failed to save score:', error)
    }
  }

  const playAgain = () => {
    router.refresh()
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading questions...</p>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Answer trivia questions for dartboard points
        </p>
      </div>

      {!isComplete ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg">
                Question {currentQuestion + 1} of {questions.length}
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span className={timeLeft <= 10 ? 'text-red-500 font-bold' : ''}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Target className="w-4 h-4 text-amber-500" />
                  {score} pts
                </div>
              </div>
            </div>
            <CardDescription>
              {attempts === 0 && '🎯 Bullseye: 50 pts'}
              {attempts === 1 && '🔴 Inner Bull: 25 pts'}
              {attempts === 2 && '🔷 Triple: 20 pts'}
              {attempts === 3 && '🔶 Double: 10 pts'}
              {attempts === 4 && '⚪ Single: 5 pts'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">{currentQ.question}</h2>

              <div className="grid gap-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer === index && selectedAnswer === currentQ.correctAnswer}
                    className={`p-4 text-left rounded-lg border-2 transition-all ${
                      selectedAnswer === index
                        ? index === currentQ.correctAnswer
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : selectedAnswer !== null
                        ? 'opacity-50'
                        : 'border-border hover:border-primary hover:bg-muted'
                    }`}
                  >
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
              className="w-full"
            >
              Submit Answer
            </Button>

            {attempts > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Attempts: {attempts + 1}/5
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-2" />
            <CardTitle className="text-3xl">Game Complete!</CardTitle>
            <CardDescription>Here's how you scored</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">{score} Points</div>
              <p className="text-muted-foreground">
                {answeredQuestions.length} out of {questions.length} questions correct
              </p>
            </div>

            {/* Score breakdown */}
            <div className="border rounded-lg p-4 space-y-2 text-sm">
              <div className="font-semibold mb-2">Dartboard Scoring:</div>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <span>🎯 Bullseye (1st try):</span>
                <span>50 pts</span>
                <span>🔴 Inner Bull (2nd try):</span>
                <span>25 pts</span>
                <span>🔷 Triple (3rd try):</span>
                <span>20 pts</span>
                <span>🔶 Double (4th try):</span>
                <span>10 pts</span>
                <span>⚪ Single (5th try):</span>
                <span>5 pts</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={playAgain} className="flex-1">
                Play Again
              </Button>
              <Button onClick={() => router.push('/games')} variant="outline">
                All Games
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
