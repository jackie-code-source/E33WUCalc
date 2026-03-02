(function () {

  const COSTS = {
    "1": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 0, perfect: 0 },
    "2": { catalysts: 1, polished: 0, resplendent: 0, grandiose: 0, perfect: 0 },
    "3": { catalysts: 2, polished: 0, resplendent: 0, grandiose: 0, perfect: 0 },

    "4": { catalysts: 0, polished: 1, resplendent: 0, grandiose: 0, perfect: 0 },
    "5": { catalysts: 0, polished: 1, resplendent: 0, grandiose: 0, perfect: 0 },
    "6": { catalysts: 0, polished: 2, resplendent: 0, grandiose: 0, perfect: 0 },
    "7": { catalysts: 0, polished: 2, resplendent: 0, grandiose: 0, perfect: 0 },
    "8": { catalysts: 0, polished: 3, resplendent: 0, grandiose: 0, perfect: 0 },
    "9": { catalysts: 0, polished: 3, resplendent: 0, grandiose: 0, perfect: 0 },

    "10": { catalysts: 0, polished: 0, resplendent: 1, grandiose: 0, perfect: 0 },
    "11": { catalysts: 0, polished: 0, resplendent: 1, grandiose: 0, perfect: 0 },
    "12": { catalysts: 0, polished: 0, resplendent: 2, grandiose: 0, perfect: 0 },
    "13": { catalysts: 0, polished: 0, resplendent: 2, grandiose: 0, perfect: 0 },
    "14": { catalysts: 0, polished: 0, resplendent: 2, grandiose: 0, perfect: 0 },
    "15": { catalysts: 0, polished: 0, resplendent: 3, grandiose: 0, perfect: 0 },
    "16": { catalysts: 0, polished: 0, resplendent: 3, grandiose: 0, perfect: 0 },
    "17": { catalysts: 0, polished: 0, resplendent: 4, grandiose: 0, perfect: 0 },
    "18": { catalysts: 0, polished: 0, resplendent: 4, grandiose: 0, perfect: 0 },
    "19": { catalysts: 0, polished: 0, resplendent: 5, grandiose: 0, perfect: 0 },

    "20": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 1, perfect: 0 },
    "21": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 1, perfect: 0 },
    "22": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 1, perfect: 0 },
    "23": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 2, perfect: 0 },
    "24": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 2, perfect: 0 },
    "25": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 2, perfect: 0 },
    "26": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 3, perfect: 0 },
    "27": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 3, perfect: 0 },
    "28": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 3, perfect: 0 },
    "29": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 4, perfect: 0 },
    "30": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 4, perfect: 0 },
    "31": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 4, perfect: 0 },
    "32": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 5, perfect: 0 },

    "33": { catalysts: 0, polished: 0, resplendent: 0, grandiose: 0, perfect: 1 }
  };

  const el = (s) => document.querySelector(s);
  const ui = {
    current: el("#current"),
    target: el("#target"),
    calc: el("#calc"),
    reset: el("#resetLevels"),
    msg: el("#msg"),
    steps: el("#steps"),
    totalMaterials: el("#totalMats"),
    tbody: el("#tbody"),
  };

  function emptyResults() {
    return {
      steps: 0,
      totalMats: 0,
      catalysts: 0,
      polished: 0,
      resplendent: 0,
      grandiose: 0,
      perfect: 0,
      rows: [],
    };
  }

  function error(msg) {
    ui.msg.textContent = msg;
    ui.msg.classList.remove("ok");
    ui.msg.classList.add("err");
  }

  function info(msg) {
    ui.msg.textContent = msg;
    ui.msg.classList.remove("err");
    ui.msg.classList.add("ok");
  }

  function computeTotals(current, target, costs) {
    const results = emptyResults();
    if (target <= current) return results;
  
    for (let lvl = current; lvl < target; lvl++) {
      const row = costs[String(lvl + 1)];
      if (!row) throw new Error(`No cost defined for level ${lvl} → ${lvl + 1}.`); //If user puts anything above 33

      // Find the materials for this upgrade, defaulting to 0 if not defined
      const catalysts = Number(row.catalysts ?? 0);
      const polished = Number(row.polished ?? 0);
      const resplendent = Number(row.resplendent ?? 0);
      const grandiose = Number(row.grandiose ?? 0);
      const perfect = Number(row.perfect ?? 0);

      
      results.steps++;
      results.catalysts += catalysts;
      results.polished += polished;
      results.resplendent += resplendent;
      results.grandiose += grandiose;
      results.perfect += perfect;

      results.rows.push({
        from: lvl,
        to: lvl + 1,
        catalysts,
        polished,
        resplendent,
        grandiose,
        perfect,
      });
    }
    results.totalMats = `Catalysts: ${results.catalysts}, Polished: ${results.polished}, Resplendent: ${results.resplendent}, Grandiose: ${results.grandiose}, Perfect: ${results.perfect}`;
    return results;
  }

  function renderResult(res) {
    ui.steps.textContent = String(res.steps);
    ui.totalMaterials.textContent = String(res.totalMats);

    ui.tbody.innerHTML = "";
    for (const r of res.rows) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.from} → ${r.to}</td>
        <td>${r.catalysts}</td>
        <td>${r.polished}</td>
        <td>${r.resplendent}</td>
        <td>${r.grandiose}</td>
        <td>${r.perfect}</td>`;
      ui.tbody.appendChild(tr);
    }
  }

  function handleCalc() {
    ui.msg.textContent = "";
    const cur = Number(ui.current.value);
    const tar = Number(ui.target.value);

    if (!Number.isInteger(cur) || !Number.isInteger(tar) || cur < 1 || tar < 1) {
      return error("Enter positive integers for levels.");
    }
    if (tar < cur) return error("Target must be higher than current.");
    if (tar === cur) {
      renderResult(emptyResults());
      return info("Already at target.");
    }

    try {
      const res = computeTotals(cur, tar, COSTS);
      renderResult(res);
      info("Calculated.");
    } catch (e) {
      error(e.message);
    }
  }

  ui.calc.addEventListener("click", handleCalc);

  ui.reset.addEventListener("click", () => {
    ui.current.value = 1;
    ui.target.value = 10;
    ui.msg.textContent = "";
    renderResult(emptyResults());
  });

  // Initial render
  renderResult(emptyResults());
})();