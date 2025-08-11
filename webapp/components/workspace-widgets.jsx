"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

import { Cloud, MapPin } from "lucide-react";

const cities = [
    { id: "colombo", name: "Colombo" },
    { id: "bangkok", name: "Bangkok" },
    { id: "lisbon", name: "Lisbon" },
    { id: "tbilisi", name: "Tbilisi" },
    { id: "bali", name: "Denpasar (Bali)" },
    { id: "saigon", name: "Ho Chi Minh City" },
];

export function WorkspaceWidgets() {
    const [cityA, setCityA] = useState("colombo");
    const [cityB, setCityB] = useState("bangkok");
    const [open, setOpen] = useState(false);
    const [simOpen, setSimOpen] = useState(false);
    const [simCountry, setSimCountry] = useState("lk");
    const [planA, setPlanA] = useState("dialog20");
    const [planB, setPlanB] = useState("airalo5");


    const cityName = (id) => cities.find((c) => c.id === id)?.name ?? id;

    function plansFor(country) {
        const all = {
            lk: [
                { id: "dialog20", name: "Dialog Tourist eSIM 20GB / 30d" },
                { id: "airalo5", name: "Airalo Sri Lanka 5GB / 30d" },
                { id: "hutch10", name: "Hutch Local 10GB / 30d" },
            ],
            th: [
                { id: "ais15", name: "AIS eSIM 15GB / 15d" },
                { id: "dtac10", name: "DTAC eSIM 10GB / 10d" },
                { id: "airalo10", name: "Airalo Thailand 10GB / 30d" },
            ],
            id: [
                { id: "telkomsel20", name: "Telkomsel eSIM 20GB / 30d" },
                { id: "xl10", name: "XL 10GB / 30d" },
                { id: "airalo3", name: "Airalo Indonesia 3GB / 30d" },
            ],
        };
        return all[country] ?? [];
    }

    function planLabel(id) {
        const item = [...plansFor("lk"), ...plansFor("th"), ...plansFor("id")].find((p) => p.id === id);
        return item?.name ?? id;
    }

    function planShort(id) {
        return planLabel(id).split(" ")[0];
    }

    function compareRows(a, b) {
        const data = {
            dialog20: { data: "20GB", validity: "30 days", price: "$12", hotspot: "Yes", fiveg: "No" },
            airalo5: { data: "5GB", validity: "30 days", price: "$8", hotspot: "Yes", fiveg: "No" },
            hutch10: { data: "10GB", validity: "30 days", price: "$10", hotspot: "No", fiveg: "No" },
            ais15: { data: "15GB", validity: "15 days", price: "$14", hotspot: "Yes", fiveg: "Yes" },
            dtac10: { data: "10GB", validity: "10 days", price: "$9", hotspot: "Yes", fiveg: "Yes" },
            airalo10: { data: "10GB", validity: "30 days", price: "$12", hotspot: "Yes", fiveg: "No" },
            telkomsel20: { data: "20GB", validity: "30 days", price: "$13", hotspot: "Yes", fiveg: "Yes" },
            xl10: { data: "10GB", validity: "30 days", price: "$9", hotspot: "No", fiveg: "No" },
            airalo3: { data: "3GB", validity: "30 days", price: "$5", hotspot: "Yes", fiveg: "No" },
        };

        const A = data[a] ?? {};
        const B = data[b] ?? {};
        return [
            { k: "Data", a: A.data, b: B.data },
            { k: "Validity", a: A.validity, b: B.validity },
            { k: "Price", a: A.price, b: B.price },
            { k: "Hotspot", a: A.hotspot, b: B.hotspot },
            { k: "5G", a: A.fiveg, b: B.fiveg },
        ];
    }



    return (
        <div className="px-8 pb-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-12">
                {/* Currency converter */}
                <Card className="rounded-2xl border-gray-200 md:col-span-2 xl:col-span-6 shadow-none h-[280px] overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardDescription>1 United States Dollar equals</CardDescription>
                        <CardTitle className="text-2xl md:text-3xl">300.37 Sri Lankan Rupee</CardTitle>
                        <CardDescription>Aug 9, 13:22 UTC · From Morningstar</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-5">
                                <Input defaultValue="1" className="h-12 rounded-xl" />
                            </div>
                            <div className="col-span-7">
                                <Select defaultValue="usd">
                                    <SelectTrigger className="h-12 w-full rounded-xl">
                                        <SelectValue placeholder="Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usd">United States Dollar</SelectItem>
                                        <SelectItem value="lkr">Sri Lankan Rupee</SelectItem>
                                        <SelectItem value="eur">Euro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-5">
                                <Input defaultValue="300.37" className="h-12 rounded-xl" />
                            </div>
                            <div className="col-span-7">
                                <Select defaultValue="lkr">
                                    <SelectTrigger className="h-12 w-full rounded-xl">
                                        <SelectValue placeholder="Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usd">United States Dollar</SelectItem>
                                        <SelectItem value="lkr">Sri Lankan Rupee</SelectItem>
                                        <SelectItem value="eur">Euro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Weather card (enhanced UX) */}
                <Card
                    className="relative md:col-span-1 xl:col-span-3 h-[280px] overflow-hidden rounded-2xl border-0 shadow-none p-0 text-white"
                >
                    {/* layered gradients for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#4e6b8a] via-[#6f86a6] to-[#a9abb0]" />
                    <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative h-full w-full p-5 flex flex-col">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-4xl md:text-5xl font-semibold leading-none tracking-tight">29°C</div>
                                <div className="mt-2 inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-xs md:text-sm backdrop-blur">
                                    Cloudy
                                </div>
                            </div>
                            <Cloud className="size-12 md:size-14 text-white/95 drop-shadow-lg" />
                        </div>
                        <div className="mt-auto flex items-center gap-2 text-sm md:text-base font-medium text-white/95">
                            <MapPin className="size-4 md:size-5 text-white/95" />
                            Kolonnawa, Sri Lanka
                        </div>
                        <div className="text-[10px] md:text-xs text-white/70">Updated 2 min ago</div>
                    </div>
                </Card>

                {/* Emergency contacts (replaces Visa Stay Calculator) */}
                <Card className="rounded-2xl border-red-500 md:col-span-1 xl:col-span-3 h-[280px] shadow-none overflow-hidden">
                    <CardHeader className="pb-0 pt-1 gap-0">
                        <CardTitle className="text-lg text-red-600">Emergency Contacts</CardTitle>
                    </CardHeader>
                    <CardContent className="w-full h-full -mt-1 flex flex-col gap-1 text-sm">
                        <div className="grid grid-cols-1 gap-1.5 flex-1 min-h-0 overflow-y-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                                <span className="font-medium">Police Emergency</span>
                                <a className="text-red-600 font-semibold" href="tel:119">119</a>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                                <span className="font-medium">Ambulance / Fire & Rescue</span>
                                <a className="text-red-600 font-semibold" href="tel:110">110</a>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                                <span className="font-medium">Suwa Seriya Ambulance</span>
                                <a className="text-red-600 font-semibold" href="tel:1990">1990</a>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                                <span className="font-medium">Tourist Police</span>
                                <a className="text-red-600 font-semibold" href="tel:1912">1912</a>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                                <span className="font-medium">Disaster Management</span>
                                <a className="text-red-600 font-semibold" href="tel:117">117</a>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                                <span className="font-medium">Accident Service (Colombo)</span>
                                <a className="text-red-600 font-semibold" href="tel:0112691111">011-2691111</a>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                                <span className="font-medium">Colombo Fire/Ambulance</span>
                                <a className="text-red-600 font-semibold" href="tel:0112422222">011-2422222</a>
                            </div>
                        </div>
                        <div className="pt-1 mt-auto text-xs text-muted-foreground">Tap a number to dial instantly.</div>
                    </CardContent>
                </Card>

                {/* Local SIM / eSIM comparator (left small card) */}
                <Card className="rounded-2xl border-gray-200 md:col-span-1 lg:col-span-2 xl:col-span-4 h-[280px] shadow-none overflow-hidden">
                    <CardContent className="space-y-1">
                        <CardTitle className="text-xl pb-3 font-semibold text-gray-800">Compare Plans</CardTitle>

                        <div className="space-y-2">
                            <Label htmlFor="country-select" className="text-xs font-medium text-gray-600">
                                Country
                            </Label>
                            <Select value={simCountry} onValueChange={setSimCountry}>
                                <SelectTrigger id="country-select" className="h-11 w-full rounded-xl border-2 text-sm">
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="lk">Sri Lanka</SelectItem>
                                    <SelectItem value="th">Thailand</SelectItem>
                                    <SelectItem value="id">Indonesia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="plan-a" className="text-xs font-medium text-gray-600 mb-2 block">
                                    Plan A
                                </Label>
                                <Select value={planA} onValueChange={setPlanA}>
                                    <SelectTrigger id="plan-a" className="h-11 w-full rounded-xl border-2 text-sm">
                                        <SelectValue placeholder="Choose Plan A" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {plansFor(simCountry).map((p) => (
                                            <SelectItem key={p.id} value={p.id}>{planLabel(p.id)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="plan-b" className="text-xs font-medium text-gray-600 mb-2 block">
                                    Plan B
                                </Label>
                                <Select value={planB} onValueChange={setPlanB}>
                                    <SelectTrigger id="plan-b" className="h-11 w-full rounded-xl border-2 text-sm">
                                        <SelectValue placeholder="Choose Plan B" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {plansFor(simCountry).map((p) => (
                                            <SelectItem key={p.id} value={p.id}>{planLabel(p.id)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                            <Sheet open={simOpen} onOpenChange={setSimOpen}>
                                <SheetTrigger asChild>
                                    <Button className="w-full h-10 rounded-xl text-white font-bold text-sm " onClick={() => setSimOpen(true)}>
                                        Compare Plans
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="sm:max-w-md md:max-w-lg">
                                    <SheetHeader>
                                        <SheetTitle>Plan comparison</SheetTitle>
                                        <SheetDescription>{planLabel(planA)} vs {planLabel(planB)}</SheetDescription>
                                    </SheetHeader>
                                    <div className="p-4 space-y-4">
                                        <div className="grid grid-cols-12 items-end">
                                            <div className="col-span-5 text-xl font-semibold">{planShort(planA)}</div>
                                            <div className="col-span-2 text-center text-xs uppercase text-muted-foreground">vs</div>
                                            <div className="col-span-5 text-right text-xl font-semibold">{planShort(planB)}</div>
                                        </div>
                                        <div className="rounded-lg border overflow-hidden">
                                            <div className="grid grid-cols-12 bg-muted/50 text-xs font-medium px-3 py-2">
                                                <div className="col-span-6">Feature</div>
                                                <div className="col-span-3 text-right">{planShort(planA)}</div>
                                                <div className="col-span-3 text-right">{planShort(planB)}</div>
                                            </div>
                                            {compareRows(planA, planB).map((row) => (
                                                <div key={row.k} className="grid grid-cols-12 items-center px-3 py-2 text-sm border-t">
                                                    <div className="col-span-6 font-medium">{row.k}</div>
                                                    <div className="col-span-3 text-right">{row.a}</div>
                                                    <div className="col-span-3 text-right">{row.b}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </CardContent>
                </Card>

                {/* Simple card to replace calendar */}
                <Card className="rounded-2xl border-gray-200 md:col-span-1 lg:col-span-1 shadow-none xl:col-span-3 h-[280px] overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Quick Info</CardTitle>
                        <CardDescription>Important updates and reminders</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="rounded-lg bg-blue-50 border border-blue-200 p-2">
                            <div className="text-xs font-medium text-blue-900">Today's Date</div>
                            <div className="text-sm font-semibold text-blue-700">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                        <div className="rounded-lg bg-green-50 border border-green-200 p-2">
                            <div className="text-xs font-medium text-green-900">Local Time</div>
                            <div className="text-sm font-semibold text-green-700">
                                {new Date().toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* News column: large card on the right */}
                <Card className="rounded-2xl border-gray-200 shadow-none md:col-span-2 lg:col-span-3 xl:col-span-5 h-[280px] overflow-hidden">

                    <CardContent className="h-full flex flex-col">
                        <CardTitle className="text-xl pb-3">Latest News</CardTitle>
                        <div className="grid grid-cols-1 gap-3 flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {[
                                { title: "Mannar project: Energy Minister dismisses claims of threat to birds", src: "Newswire.lk", time: "1 hour ago", excerpt: "Dismissing claims that wind power projects...", link: "#" },
                                { title: "Booking Train tickets: Mandatory identification verification launched", src: "Newswire.lk", time: "1 hour ago", excerpt: "Sri Lanka Railways has launched a mandatory...", link: "#" },
                                { title: "Vietnamese woman drowns in Aluthgama", src: "Newswire.lk", time: "1 hour ago", excerpt: "A foreign woman who went for a swim at the...", link: "#" },
                                { title: "155 bus service recommenced", src: "Newswire.lk", time: "1 hour ago", excerpt: "The 155 bus service from Mattakkuliya to...", link: "#" },
                            ].map((n, idx) => (
                                <div key={idx} className="rounded-xl border p-3 bg-card/50">
                                    <div className="text-base font-semibold leading-snug line-clamp-2">{n.title}</div>
                                    <div className="mt-1 text-xs text-muted-foreground">{n.src} · {n.time}</div>
                                    <div className="mt-2 text-sm text-muted-foreground line-clamp-2">{n.excerpt}</div>
                                    <a href={n.link} className="mt-2 inline-flex items-center text-primary text-sm font-medium">Read More →</a>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


