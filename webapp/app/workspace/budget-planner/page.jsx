"use client"

import { useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

const COLORS = {
    accommodation: "#10b981", // green
    food: "#3b82f6", // blue
    transportation: "#f59e0b", // amber
    coworking: "#8b5cf6", // violet
    entertainment: "#ef4444", // red
    utilities: "#06b6d4" // cyan
}

const CITIES = [
    { name: "Colombo", multiplier: 1.0 },
    { name: "Kandy", multiplier: 0.75 },
    { name: "Galle", multiplier: 0.8 },
    { name: "Negombo", multiplier: 0.85 }
]

const EXCHANGE_RATES = {
    USD: 320,
    EUR: 350,
    LKR: 1
}

export default function NomadBudgetPlanner() {
    const [currency, setCurrency] = useState("USD")
    const [budget, setBudget] = useState({
        accommodation: 800,
        food: 400,
        transportation: 150,
        coworking: 100,
        entertainment: 200,
        utilities: 80
    })
    const [selectedCities, setSelectedCities] = useState(["Colombo", "Kandy"])
    const [exchangeRateChange, setExchangeRateChange] = useState(0)
    const [emergencyFund, setEmergencyFund] = useState({
        monthsCoverage: 6,
        currentSavings: 5000,
        visaRuns: 500,
        medical: 1000,
        flightHome: 800
    })

    const totalBudget = Object.values(budget).reduce(
        (sum, value) => sum + value,
        0
    )
    const dailyBudget = totalBudget / 30

    const budgetData = Object.entries(budget).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
        color: COLORS[key]
    }))

    const cityComparison = selectedCities.map(cityName => {
        const city = CITIES.find(c => c.name === cityName)
        return {
            city: cityName,
            accommodation: Math.round(budget.accommodation * city.multiplier),
            food: Math.round(budget.food * city.multiplier),
            transportation: Math.round(budget.transportation * city.multiplier),
            coworking: Math.round(budget.coworking * city.multiplier),
            entertainment: Math.round(budget.entertainment * city.multiplier),
            utilities: Math.round(budget.utilities * city.multiplier),
            total: Math.round(totalBudget * city.multiplier)
        }
    })

    const currentExchangeRate = EXCHANGE_RATES[currency]
    const adjustedRate = currentExchangeRate * (1 + exchangeRateChange / 100)
    const budgetImpact =
        ((adjustedRate - currentExchangeRate) / currentExchangeRate) * 100

    const emergencyTotal =
        emergencyFund.monthsCoverage * totalBudget +
        emergencyFund.visaRuns +
        emergencyFund.medical +
        emergencyFund.flightHome
    const emergencyProgress =
        (emergencyFund.currentSavings / emergencyTotal) * 100
    const monthsToGoal = Math.max(
        0,
        Math.ceil(
            (emergencyTotal - emergencyFund.currentSavings) / (totalBudget * 0.2)
        )
    )

    const updateBudgetItem = (key, value) => {
        setBudget(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Nomad Budget Planner
                        </h1>
                        <p className="text-muted-foreground">
                            Plan your digital nomad budget for Sri Lanka
                        </p>
                    </div>
                    <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="LKR">LKR</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Tabs defaultValue="budget" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="budget">Monthly Budget</TabsTrigger>
                        <TabsTrigger value="currency">Currency Impact</TabsTrigger>
                        <TabsTrigger value="emergency">Emergency Fund</TabsTrigger>
                    </TabsList>

                    {/* Monthly Budget Breakdown */}
                    <TabsContent value="budget" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="shadow-none">
                                <CardHeader>
                                    <CardTitle>Budget Categories</CardTitle>
                                    <CardDescription>
                                        Adjust your monthly expenses
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {Object.entries(budget).map(([key, value]) => (
                                        <div key={key} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label className="capitalize">
                                                    {key.replace(/([A-Z])/g, " $1")}
                                                </Label>
                                                <span className="text-sm font-medium">
                                                    {currency} {value}
                                                </span>
                                            </div>
                                            <Slider
                                                value={[value]}
                                                onValueChange={([newValue]) =>
                                                    updateBudgetItem(key, newValue)
                                                }
                                                max={
                                                    key === "accommodation"
                                                        ? 2000
                                                        : key === "food"
                                                            ? 800
                                                            : key === "entertainment"
                                                                ? 400
                                                                : key === "transportation"
                                                                    ? 300
                                                                    : key === "coworking"
                                                                        ? 200
                                                                        : 150
                                                }
                                                step={10}
                                                className="w-full"
                                            />
                                            <Input
                                                type="number"
                                                value={value}
                                                onChange={e =>
                                                    updateBudgetItem(
                                                        key,
                                                        Number.parseInt(e.target.value) || 0
                                                    )
                                                }
                                                className="w-full"
                                            />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <div className="space-y-6">
                                <Card className="shadow-none">
                                    <CardHeader>
                                        <CardTitle>Budget Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-lg font-semibold">
                                                <span>Monthly Total:</span>
                                                <span>
                                                    {currency} {totalBudget}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                                <span>Daily Average:</span>
                                                <span>
                                                    {currency} {dailyBudget.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-none">
                                    <CardHeader>
                                        <CardTitle>Budget Breakdown</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={budgetData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={120}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {budgetData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={value => [
                                                        `${currency} ${value}`,
                                                        "Amount"
                                                    ]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            {budgetData.map(item => (
                                                <div
                                                    key={item.name}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <span className="text-sm">{item.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>



                    {/* Currency Impact Calculator */}
                    <TabsContent value="currency" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="shadow-none">
                                <CardHeader>
                                    <CardTitle>Exchange Rate Impact</CardTitle>
                                    <CardDescription>
                                        See how currency fluctuations affect your budget
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Current Exchange Rate</Label>
                                        <div className="text-2xl font-bold">
                                            1 {currency} = {currentExchangeRate} LKR
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label>
                                            Exchange Rate Change: {exchangeRateChange > 0 ? "+" : ""}
                                            {exchangeRateChange}%
                                        </Label>
                                        <Slider
                                            value={[exchangeRateChange]}
                                            onValueChange={([value]) => setExchangeRateChange(value)}
                                            min={-50}
                                            max={50}
                                            step={1}
                                            className="w-full"
                                        />
                                        <div className="text-sm text-muted-foreground">
                                            New Rate: 1 {currency} = {adjustedRate.toFixed(2)} LKR
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Budget Impact</Label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-semibold">
                                                {budgetImpact > 0 ? "+" : ""}
                                                {budgetImpact.toFixed(1)}%
                                            </span>
                                            {Math.abs(budgetImpact) > 10 && (
                                                <Badge variant="destructive">Significant Impact</Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-none">
                                <CardHeader>
                                    <CardTitle>Budget in Local Currency</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span>Current Budget (LKR):</span>
                                            <span className="font-semibold">
                                                {(totalBudget * currentExchangeRate).toLocaleString()}{" "}
                                                LKR
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Adjusted Budget (LKR):</span>
                                            <span className="font-semibold">
                                                {(totalBudget * adjustedRate).toLocaleString()} LKR
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                                            <span>Difference:</span>
                                            <span>
                                                {(
                                                    totalBudget * adjustedRate -
                                                    totalBudget * currentExchangeRate
                                                ).toLocaleString()}{" "}
                                                LKR
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Emergency Fund Calculator */}
                    <TabsContent value="emergency" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="shadow-none">
                                <CardHeader>
                                    <CardTitle>Emergency Fund Settings</CardTitle>
                                    <CardDescription>
                                        Plan for unexpected expenses
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>
                                            Months of Coverage: {emergencyFund.monthsCoverage}
                                        </Label>
                                        <Slider
                                            value={[emergencyFund.monthsCoverage]}
                                            onValueChange={([value]) =>
                                                setEmergencyFund(prev => ({
                                                    ...prev,
                                                    monthsCoverage: value
                                                }))
                                            }
                                            min={3}
                                            max={12}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Current Savings ({currency})</Label>
                                        <Input
                                            type="number"
                                            value={emergencyFund.currentSavings}
                                            onChange={e =>
                                                setEmergencyFund(prev => ({
                                                    ...prev,
                                                    currentSavings: Number.parseInt(e.target.value) || 0
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Special Emergency Categories</Label>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Visa Runs</span>
                                                <Input
                                                    type="number"
                                                    value={emergencyFund.visaRuns}
                                                    onChange={e =>
                                                        setEmergencyFund(prev => ({
                                                            ...prev,
                                                            visaRuns: Number.parseInt(e.target.value) || 0
                                                        }))
                                                    }
                                                    className="w-24"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Medical</span>
                                                <Input
                                                    type="number"
                                                    value={emergencyFund.medical}
                                                    onChange={e =>
                                                        setEmergencyFund(prev => ({
                                                            ...prev,
                                                            medical: Number.parseInt(e.target.value) || 0
                                                        }))
                                                    }
                                                    className="w-24"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Flight Home</span>
                                                <Input
                                                    type="number"
                                                    value={emergencyFund.flightHome}
                                                    onChange={e =>
                                                        setEmergencyFund(prev => ({
                                                            ...prev,
                                                            flightHome: Number.parseInt(e.target.value) || 0
                                                        }))
                                                    }
                                                    className="w-24"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-none">
                                <CardHeader>
                                    <CardTitle>Emergency Fund Progress</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span>Target Amount:</span>
                                            <span className="font-semibold">
                                                {currency} {emergencyTotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Current Savings:</span>
                                            <span className="font-semibold">
                                                {currency}{" "}
                                                {emergencyFund.currentSavings.toLocaleString()}
                                            </span>
                                        </div>
                                        <Progress value={emergencyProgress} className="w-full" />
                                        <div className="text-sm text-muted-foreground text-center">
                                            {emergencyProgress.toFixed(1)}% Complete
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Breakdown</Label>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span>
                                                    Monthly Expenses × {emergencyFund.monthsCoverage}:
                                                </span>
                                                <span>
                                                    {currency}{" "}
                                                    {(
                                                        emergencyFund.monthsCoverage * totalBudget
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Special Categories:</span>
                                                <span>
                                                    {currency}{" "}
                                                    {(
                                                        emergencyFund.visaRuns +
                                                        emergencyFund.medical +
                                                        emergencyFund.flightHome
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {emergencyProgress < 100 && (
                                        <div className="p-3 bg-muted rounded-lg">
                                            <div className="text-sm">
                                                <div className="font-medium">Time to Goal</div>
                                                <div className="text-muted-foreground">
                                                    {monthsToGoal} months at 20% savings rate
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
