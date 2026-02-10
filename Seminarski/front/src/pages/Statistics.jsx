import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import Navigation from "../components/Navigation";
import StatsCard from "../components/StatsCard";
import api from "../api";

const Statistics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/statistika");
        console.log(response);
        setData(response.data);
      } catch (error) {
        console.error("Greška pri dohvatanju statistike:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Globalne opcije za tamnu temu grafikona
  const commonOptions = {
    backgroundColor: "transparent",
    colors: ["#6366f1", "#818cf8", "#4f46e5", "#c7d2fe", "#3730a3"],
    legend: {
      textStyle: { color: "#9ca3af", fontSize: 11 },
      position: "right",
    },
    titleTextStyle: { color: "#ffffff", fontSize: 16, bold: true },
    hAxis: { textStyle: { color: "#6b7280" }, gridlines: { color: "#282828" } },
    vAxis: { textStyle: { color: "#6b7280" }, gridlines: { color: "#282828" } },
    chartArea: { width: "85%", height: "70%" },
    animation: { startup: true, duration: 800, easing: "out" },
  };

  // Funkcija za transformaciju objekta u format koji Google Charts razume [ ['Naziv', 'Vrednost'], ... ]
  const transformToChartData = (obj, headerLabel, valueLabel) => {
    if (!obj) return [];
    return [[headerLabel, valueLabel], ...Object.entries(obj)];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navigation />

      <main className="p-8 max-w-[1400px] mx-auto">
        <header className="mb-12">
          <p className="text-indigo-500 font-black uppercase tracking-[0.4em] text-xs mb-2">
            PodcastHub Insights
          </p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
            Analitika <span className="text-indigo-500">Platforme</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Podkasti po kategorijama - Donut Chart */}
          <StatsCard title="Podkasti po kategorijama">
            <Chart
              chartType="PieChart"
              data={transformToChartData(
                data.podkasti_po_kategorijama,
                "Kategorija",
                "Broj",
              )}
              options={{ ...commonOptions, pieHole: 0.4 }}
              width="100%"
              height="300px"
            />
          </StatsCard>

          {/* 2. Emisije po danima - Area Chart */}
          <StatsCard title="Aktivnost po danima (Emisije)">
            <Chart
              chartType="AreaChart"
              data={transformToChartData(
                data.emisije_po_danima,
                "Dan",
                "Broj emisija",
              )}
              options={{
                ...commonOptions,
                areaOpacity: 0.2,
                vAxis: { ...commonOptions.vAxis, minValue: 0 },
                legend: { position: "none" },
              }}
              width="100%"
              height="300px"
            />
          </StatsCard>

          {/* 3. Rangiranje autora - Bar Chart */}
          <StatsCard title="Top Autori po broju podkasta">
            <Chart
              chartType="BarChart"
              data={transformToChartData(
                data.rangiranje_autora_po_podkastima,
                "Autor",
                "Podkasti",
              )}
              options={{
                ...commonOptions,
                legend: { position: "none" },
                hAxis: { ...commonOptions.hAxis, minValue: 0 },
              }}
              width="100%"
              height="400px"
            />
          </StatsCard>

          {/* 4. Tipovi emisija - Pie Chart */}
          <StatsCard title="Audio vs Video Format">
            <Chart
              chartType="PieChart"
              data={transformToChartData(
                data.tipovi_emisija_stats,
                "Tip",
                "Ukupno",
              )}
              options={{
                ...commonOptions,
                is3D: true,
                slices: { 0: { color: "#6366f1" }, 1: { color: "#818cf8" } },
              }}
              width="100%"
              height="300px"
            />
          </StatsCard>

          {/* 5. Učestvovanost autora - Pie Chart */}
          <StatsCard title="Udeo autora u ukupnom sadržaju (%)">
            <Chart
              chartType="PieChart"
              data={transformToChartData(
                data.procenat_ucestvenosti_autora,
                "Autor",
                "Procenat",
              )}
              options={{ ...commonOptions }}
              width="100%"
              height="300px"
            />
          </StatsCard>

          {/* 6. Top Omiljeni Podkasti - Column Chart */}
          <StatsCard title="Najpopularniji podkasti">
            <Chart
              chartType="ColumnChart"
              data={transformToChartData(
                data.top_omiljeni_podkasti,
                "Podkast",
                "Lajkovi",
              )}
              options={{
                ...commonOptions,
                legend: { position: "none" },
                vAxis: { ...commonOptions.vAxis, minValue: 0 },
              }}
              width="100%"
              height="300px"
            />
          </StatsCard>
        </div>
      </main>
    </div>
  );
};

export default Statistics;
