// DownloadButton.tsx
import { Page, Text, View, Document, StyleSheet, pdf, Font } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import React from "react";

// (optional) register fonts if you want custom fonts
// Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.woff2' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: 11,
    lineHeight: 1.3,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 18,
    borderBottom: "2px solid #2563eb",
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e3a8a",
    textTransform: "uppercase",
  },
  subTitle: {
    fontSize: 10,
    color: "#64748b",
  },
  nameText: {
    fontSize: 12,
    color: "#0f172a",
    fontWeight: "600",
  },
  quoteBox: {
    backgroundColor: "#f8fafc",
    borderLeft: "4px solid #2563eb",
    padding: 10,
    marginBottom: 14,
    fontStyle: "italic",
    fontSize: 11,
    color: "#475569",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 10,
    color: "#0b1220",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  table: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    padding: 8,
    alignItems: "center",
  },
  col1: { width: "50%" },
  col2: { width: "25%" },
  col3: { width: "25%" },
  boldText: { fontSize: 10, fontWeight: "bold" },
  normalText: { fontSize: 10, color: "#374151" },
  smallText: { fontSize: 9, color: "#4b5563" },
  disclaimer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 10,
  },
  twoCol: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  halfCol: {
    width: "48%",
  },
  smallRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tinyText: {
    fontSize: 8,
    color: "#64748b",
  },
});

const SafeNumber = (v: any, fallback = "-") =>
  v === undefined || v === null || v === "" ? fallback : v;

const MyDocument = ({ plan }: { plan: any }) => {
  // pick name from multiple possible keys (frontend may pass different shapes)
  const name = plan?.name || plan?.user?.name || "Valued User";
  const today = new Date().toLocaleDateString();

  // daily_workout: try plan.daily_workout else flatten first day's workout from weekly_plan
  let daily = plan?.daily_workout;
  if ((!daily || daily.length === 0) && Array.isArray(plan?.weekly_plan) && plan.weekly_plan.length > 0) {
    // Use first day as today's routine
    daily = plan.weekly_plan[0]?.workout || [];
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.title}>Fitness Blueprint</Text>
            <Text style={styles.subTitle}>Personalized AI Coach</Text>
          </View>

          <View style={{ textAlign: "right" }}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.subTitle}>Date: {today}</Text>
          </View>
        </View>

        {/* MOTIVATION */}
        <View style={styles.quoteBox}>
          <Text>
            {plan?.motivation ||
              `Congratulations on taking the first step towards your fitness journey, ${name}! Stay consistent and listen to your body.`}
          </Text>
        </View>

        {/* DAILY ROUTINE (warmup + workout + cooldown) */}
        <Text style={styles.sectionTitle}>Daily Routine</Text>

        {/* Warmup */}
        {plan?.weekly_plan && plan.weekly_plan.length > 0 && plan.weekly_plan[0]?.warmup && (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.boldText}>Warm-up</Text>
            {plan.weekly_plan[0].warmup.map((w: string, i: number) => (
              <Text key={i} style={styles.smallText}>
                • {w}
              </Text>
            ))}
          </View>
        )}

        {/* Workout Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, styles.boldText]}>EXERCISE</Text>
            <Text style={[styles.col2, styles.boldText]}>SETS / REST</Text>
            <Text style={[styles.col3, styles.boldText]}>REPS / TEMPO</Text>
          </View>

          {/* If daily array exists, render each */}
          {Array.isArray(daily) && daily.length > 0 ? (
            daily.map((item: any, idx: number) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.col1, styles.boldText]}>
                  {idx + 1}. {SafeNumber(item.exercise)}
                </Text>
                <Text style={[styles.col2, styles.normalText]}>
                  {SafeNumber(item.sets)} • {SafeNumber(item.rest)}
                </Text>
                <Text style={[styles.col3, styles.normalText]}>
                  {SafeNumber(item.reps)} • {SafeNumber(item.tempo || "-")}
                </Text>
              </View>
            ))
          ) : (
            <View style={[styles.tableRow]}>
              <Text style={styles.smallText}>No daily workout found — please generate a plan for full details.</Text>
            </View>
          )}
        </View>

        {/* Cooldown & Notes */}
        {plan?.weekly_plan && plan.weekly_plan.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.boldText}>Cooldown</Text>
            {plan.weekly_plan[0].cooldown?.map((c: string, i: number) => (
              <Text key={i} style={styles.smallText}>
                • {c}
              </Text>
            ))}

            {plan.weekly_plan[0].notes && (
              <View style={{ marginTop: 6 }}>
                <Text style={styles.boldText}>Notes</Text>
                <Text style={styles.smallText}>{plan.weekly_plan[0].notes}</Text>
              </View>
            )}
          </View>
        )}

        {/* NUTRITION PLAN */}
        <Text style={styles.sectionTitle}>Nutrition Plan</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, styles.boldText]}>MEAL / FOOD ITEM</Text>
            <Text style={[styles.col2, styles.boldText]}>TYPE</Text>
            <Text style={[styles.col3, styles.boldText]}>CALORIES</Text>
          </View>

          {Array.isArray(plan?.diet) && plan.diet.length > 0 ? (
            plan.diet.map((item: any, idx: number) => (
              <View key={idx} style={styles.tableRow}>
                <View style={styles.col1}>
                  <Text style={styles.boldText}>{SafeNumber(item.food)}</Text>
                  {/* macros line */}
                  {item?.macros && (
                    <Text style={styles.smallText}>
                      {`P: ${item.macros.protein || "-"} • C: ${item.macros.carbs || "-"} • F: ${item.macros.fat || "-"}`}
                    </Text>
                  )}
                </View>

                <Text style={[styles.col2, styles.normalText]}>{SafeNumber(item.meal)}</Text>
                <Text style={[styles.col3, styles.normalText]}>{SafeNumber(item.calories)} kcal</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.smallText}>No diet items found — generate a plan for meal details.</Text>
            </View>
          )}
        </View>

        {/* NUTRITION SUMMARY */}
        <Text style={styles.sectionTitle}>Nutrition Summary</Text>
        <View style={styles.twoCol}>
          <View style={styles.halfCol}>
            <Text style={styles.boldText}>Daily Targets</Text>
            <Text style={styles.smallText}>Calories: {SafeNumber(plan?.nutrition_summary?.total_daily_calories)}</Text>
            <Text style={styles.smallText}>Protein: {SafeNumber(plan?.nutrition_summary?.protein_target)}</Text>
            <Text style={styles.smallText}>Carbs: {SafeNumber(plan?.nutrition_summary?.carb_target)}</Text>
            <Text style={styles.smallText}>Fats: {SafeNumber(plan?.nutrition_summary?.fat_target)}</Text>
          </View>

          <View style={styles.halfCol}>
            <Text style={styles.boldText}>Lifestyle</Text>
            <Text style={styles.smallText}>Hydration: {SafeNumber(plan?.nutrition_summary?.hydration_goal)}</Text>
            <Text style={styles.smallText}>Sleep: {SafeNumber(plan?.lifestyle?.sleep_goal)}</Text>
            <Text style={styles.smallText}>Steps goal: {SafeNumber(plan?.lifestyle?.steps_goal)}</Text>
          </View>
        </View>

        {/* WEEKLY QUICK VIEW */}
        {Array.isArray(plan?.weekly_plan) && plan.weekly_plan.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Weekly Plan (Quick View)</Text>
            {plan.weekly_plan.map((d: any, i: number) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={styles.boldText}>
                  {d.day} — {SafeNumber(d.focus)} ({SafeNumber(d.duration)})
                </Text>
                <Text style={styles.smallText}>Warm-up: {Array.isArray(d.warmup) ? d.warmup.join(", ") : SafeNumber(d.warmup)}</Text>
                <Text style={styles.smallText}>Main: {Array.isArray(d.workout) ? d.workout.slice(0, 3).map((w: any) => w.exercise).join(", ") : "-"}</Text>
                <Text style={styles.smallText}>Cooldown: {Array.isArray(d.cooldown) ? d.cooldown.join(", ") : SafeNumber(d.cooldown)}</Text>
              </View>
            ))}
          </>
        )}

        <Text style={styles.disclaimer}>
          This plan was generated by AI (Groq & Llama-3). Please consult a physician before starting any new diet or exercise program. Built with Next.js.
        </Text>
      </Page>
    </Document>
  );
};

// Export function — same usage as before
export const downloadPDF = async (plan: any) => {
  try {
    if (typeof window === "undefined") return;
    const blob = await pdf(<MyDocument plan={plan} />).toBlob();
    saveAs(blob, `Fitness_Plan_${plan?.name ? plan.name.replace(/\s+/g, "_") : "User"}.pdf`);
  } catch (err) {
    console.error("PDF generation error:", err);
  }
};
