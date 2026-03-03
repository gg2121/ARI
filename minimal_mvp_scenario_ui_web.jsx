import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CheckCircle2, Play, Sparkles, Wand2 } from "lucide-react";

/**
 * Minimal MVP UI mock for a scenario-based communication simulator.
 * Goal: make it obvious for a developer how the flow + required fields work.
 *
 * Flow:
 * 1) Choose scenario card
 * 2) Describe context (free text)
 * 3) Fill required fields (roles, problem, stakes, resistance)
 * 4) Optional clarifying questions appear (max 3) based on missing info
 * 5) Start simulation
 */

const SCENARIOS = [
  {
    id: "C1_conflict_mediation",
    group: "Управление конфликтами",
    title: "Конфликт двух сотрудников",
    missionType: "De-escalate + Align",
    difficulty: "L2",
    summary: "Два ключевых сотрудника спорят и это влияет на результат. Вы — медиатор.",
    requiredMoves: [
      "Обозначить цель разговора",
      "Признать эмоции",
      "Перефокусировать на общую цель",
      "Зафиксировать следующий шаг",
    ],
  },
  {
    id: "C2_emotional_escalation",
    group: "Управление конфликтами",
    title: "Эмоциональная эскалация",
    missionType: "De-escalate",
    difficulty: "L3",
    summary: "Собеседник повышает голос и обвиняет. Ваша задача — снизить напряжение.",
    requiredMoves: [
      "Признать эмоции",
      "Не оправдываться сразу",
      "Перевести к фактам",
      "Предложить конструктивный формат",
    ],
  },
  {
    id: "C3_passive_resistance",
    group: "Управление конфликтами",
    title: "Пассивная агрессия",
    missionType: "Align expectations",
    difficulty: "L2",
    summary: "Сотрудник формально соглашается, но саботирует. Выводим проблему на поверхность.",
    requiredMoves: [
      "Задать уточняющий вопрос",
      "Попросить конкретику",
      "Зафиксировать ожидания",
      "Обозначить ответственность",
    ],
  },
  // You can add more groups here: Feedback, Delegation, Pushback, Negotiation...
];

const RESISTANCE_LABELS: Record<number, string> = {
  0: "Низкое",
  50: "Среднее",
  100: "Высокое",
};

function resistanceLabel(value: number) {
  if (value <= 25) return "Низкое";
  if (value <= 75) return "Среднее";
  return "Высокое";
}

export default function MinimalScenarioMVP() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id);
  const selectedScenario = useMemo(
    () => SCENARIOS.find((s) => s.id === selectedScenarioId)!,
    [selectedScenarioId]
  );

  // Core required inputs (must-have)
  const [userRole, setUserRole] = useState("Руководитель команды");
  const [aiRole, setAiRole] = useState("Сотрудник");
  const [problem, setProblem] = useState("");
  const [stakes, setStakes] = useState("");
  const [resistance, setResistance] = useState<number[]>([50]);

  // Free-text context
  const [contextText, setContextText] = useState("");

  // Optional refiners
  const [domain, setDomain] = useState("универсально");
  const [powerDistance, setPowerDistance] = useState("medium");
  const [timePressure, setTimePressure] = useState("medium");
  const [setting, setSetting] = useState("private");

  // Clarifying Qs (max 3)
  const clarifying = useMemo(() => {
    const qs: { id: string; question: string }[] = [];
    if (!problem.trim()) qs.push({ id: "q_problem", question: "Что конкретно сейчас происходит? (1–2 предложения)" });
    if (!stakes.trim()) qs.push({ id: "q_stakes", question: "Что на кону, если вы не договоритесь? (сроки/качество/репутация/деньги)" });
    if (!userRole.trim() || !aiRole.trim())
      qs.push({ id: "q_roles", question: "Кто вы и кто собеседник в этой ситуации?" });
    return qs.slice(0, 3);
  }, [problem, stakes, userRole, aiRole]);

  const canStart = useMemo(() => {
    return userRole.trim() && aiRole.trim() && problem.trim() && stakes.trim();
  }, [userRole, aiRole, problem, stakes]);

  const payloadPreview = useMemo(() => {
    return {
      scenario_id: selectedScenario.id,
      topic: selectedScenario.group,
      title: selectedScenario.title,
      mission_type: selectedScenario.missionType,
      difficulty: selectedScenario.difficulty,
      core: {
        user_role: userRole,
        ai_role: aiRole,
        problem,
        stakes,
        resistance_level: resistanceLabel(resistance[0]),
      },
      context: {
        domain,
        power_distance: powerDistance,
        time_pressure: timePressure,
        setting,
        free_text: contextText,
      },
      required_moves: selectedScenario.requiredMoves,
    };
  }, [
    selectedScenario,
    userRole,
    aiRole,
    problem,
    stakes,
    resistance,
    domain,
    powerDistance,
    timePressure,
    setting,
    contextText,
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Сценарный тренажёр коммуникации — MVP</h1>
            <p className="text-muted-foreground mt-1">
              Минималистичный интерфейс: выбираем сценарий → вводим контекст → отвечаем на уточнения → запускаем симуляцию.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Core-поля обязательны
            </Badge>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: scenario list */}
          <div className="lg:col-span-5">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">1) Выберите сценарий</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {SCENARIOS.map((s) => {
                  const active = s.id === selectedScenarioId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedScenarioId(s.id)}
                      className={
                        "w-full text-left rounded-2xl border p-4 transition " +
                        (active
                          ? "border-foreground/30 bg-foreground/[0.04]"
                          : "border-border hover:bg-muted/40")
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{s.title}</span>
                            <Badge variant="outline" className="rounded-full">{s.difficulty}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{s.summary}</div>
                        </div>
                        {active && <CheckCircle2 className="h-5 w-5 text-foreground/70" />}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="rounded-full">{s.group}</Badge>
                        <Badge variant="secondary" className="rounded-full">{s.missionType}</Badge>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Обязательные элементы (для оценки)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Эти пункты используются как <span className="font-medium">Required Moves</span> и влияют на “пройден/не пройден”.
                </div>
                <ul className="mt-2 space-y-2">
                  {selectedScenario.requiredMoves.map((m) => (
                    <li key={m} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right: inputs */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">2) Погрузите нас в контекст</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={contextText}
                  onChange={(e) => setContextText(e.target.value)}
                  placeholder={
                    "Опишите ситуацию (5–10 строк): кто с кем, что произошло, почему это важно, чего вы хотите добиться.\n" +
                    "Пример: ‘Два сотрудника спорят на планёрке, сроки горят, команда разделилась…’"
                  }
                  className="min-h-[140px] rounded-2xl"
                />
                <div className="text-xs text-muted-foreground">
                  Это поле необязательное, но помогает сделать диалог реалистичнее.
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">3) Обязательные поля (Core)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Ваша роль</label>
                    <Input
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      placeholder="Напр.: Руководитель команды"
                      className="mt-1 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Роль собеседника (бот)</label>
                    <Input
                      value={aiRole}
                      onChange={(e) => setAiRole(e.target.value)}
                      placeholder="Напр.: Сотрудник / Коллега"
                      className="mt-1 rounded-2xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">В чём проблема?</label>
                  <Input
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Напр.: спорят при команде и блокируют решения"
                    className="mt-1 rounded-2xl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Что на кону (stakes)?</label>
                  <Input
                    value={stakes}
                    onChange={(e) => setStakes(e.target.value)}
                    placeholder="Напр.: срыв дедлайна и потеря доверия клиента"
                    className="mt-1 rounded-2xl"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Сопротивление собеседника</label>
                    <span className="text-xs text-muted-foreground">{resistanceLabel(resistance[0])}</span>
                  </div>
                  <div className="mt-2">
                    <Slider value={resistance} onValueChange={setResistance} max={100} step={1} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Низкое = быстро соглашается; Высокое = спорит/давит/перекладывает ответственность.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">4) Уточняющие вопросы (если нужно)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {clarifying.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Всё ок — обязательной информации достаточно. Можно запускать.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Мы задаём максимум 3 уточнения, только если чего-то не хватает для корректной симуляции.
                    </div>
                    {clarifying.map((q) => (
                      <div key={q.id} className="rounded-2xl border p-3">
                        <div className="text-sm font-medium">{q.question}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">5) Доп. настройки (необязательно)</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-2xl">
                    <TabsTrigger value="basic" className="rounded-2xl">Контекст</TabsTrigger>
                    <TabsTrigger value="meta" className="rounded-2xl">Иерархия</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Отрасль</label>
                        <Select value={domain} onValueChange={setDomain}>
                          <SelectTrigger className="mt-1 rounded-2xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="универсально">универсально</SelectItem>
                            <SelectItem value="финансы">финансы</SelectItem>
                            <SelectItem value="страхование">страхование</SelectItem>
                            <SelectItem value="ритейл">ритейл</SelectItem>
                            <SelectItem value="промышленность">промышленность</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Давление времени</label>
                        <Select value={timePressure} onValueChange={setTimePressure}>
                          <SelectTrigger className="mt-1 rounded-2xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">нет</SelectItem>
                            <SelectItem value="medium">среднее</SelectItem>
                            <SelectItem value="high">высокое</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="text-sm font-medium">Формат</label>
                        <Select value={setting} onValueChange={setSetting}>
                          <SelectTrigger className="mt-1 rounded-2xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="private">лично</SelectItem>
                            <SelectItem value="public">при других</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="meta" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Power distance</label>
                        <Select value={powerDistance} onValueChange={setPowerDistance}>
                          <SelectTrigger className="mt-1 rounded-2xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">низкая</SelectItem>
                            <SelectItem value="medium">средняя</SelectItem>
                            <SelectItem value="high">высокая</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Высокая дистанция власти делает персонажа более осторожным и сопротивляющимся.
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-medium">Готово к запуску</div>
                    <div className="text-xs text-muted-foreground">
                      Обязательные поля должны быть заполнены, иначе симуляция будет неточной.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="rounded-2xl" onClick={() => {
                      setProblem("");
                      setStakes("");
                      setContextText("");
                      setResistance([50]);
                    }}>
                      <Wand2 className="h-4 w-4 mr-2" /> Очистить
                    </Button>
                    <Button className="rounded-2xl" disabled={!canStart}>
                      <Play className="h-4 w-4 mr-2" /> Запустить
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-sm font-medium">Preview payload (для разработчика)</div>
                <pre className="mt-2 rounded-2xl bg-muted p-3 text-xs overflow-auto max-h-[220px]">
{JSON.stringify(payloadPreview, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
