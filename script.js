(function () {
        "use strict";
        var $ = function (x) {
            return document.getElementById(x);
          },
          tip = 10;
        function number(id) {
          return Number(String($(id).value).replace(",", "."));
        }
        function money(n) {
          return (
            $("currency").value +
            n.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          );
        }
        function calculate() {
          var bill = number("bill"),
            people = number("people"),
            taxRate = number("tax"),
            custom = $("custom").value.trim() === "" ? tip : number("custom"),
            error = "";
          if (!Number.isFinite(bill) || bill < 0)
            error = "Enter a valid non-negative bill amount.";
          else if (!Number.isInteger(people) || people < 1 || people > 50)
            error = "People must be a whole number from 1 to 50.";
          else if (!Number.isFinite(custom) || custom < 0 || custom > 100)
            error = "Tip must be between 0% and 100%.";
          else if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100)
            error = "Tax must be between 0% and 100%.";
          $("error").textContent = error;
          if (error) return;
          var tax = (bill * taxRate) / 100,
            base = $("basis").value === "after" ? bill + tax : bill,
            tipMoney = (base * custom) / 100,
            total = bill + tax + tipMoney,
            per = total / people;
          if ($("round").checked) per = Math.ceil(per * 100) / 100;
          $("symbol").textContent = $("currency").value;
          $("perPerson").textContent = money(per);
          $("tipAmount").textContent = money(tipMoney);
          $("taxAmount").textContent = money(tax);
          $("grand").textContent = money(total);
          try {
            localStorage.setItem(
              "splitly:prefs",
              JSON.stringify({
                currency: $("currency").value,
                basis: $("basis").value,
                round: $("round").checked,
                tip: custom,
              }),
            );
          } catch (x) {}
        }
        document.querySelectorAll("#chips button").forEach(function (b) {
          b.onclick = function () {
            tip = +b.dataset.tip;
            $("custom").value = "";
            document.querySelectorAll("#chips button").forEach(function (x) {
              x.classList.toggle("active", x === b);
            });
            calculate();
          };
        });
        [
          "bill",
          "people",
          "tax",
          "custom",
          "currency",
          "basis",
          "round",
        ].forEach(function (id) {
          $(id).addEventListener("input", calculate);
          $(id).addEventListener("change", calculate);
        });
        $("copy").onclick = async function () {
          var text =
            "Bill split: " +
            $("grand").textContent +
            " total, " +
            $("tipAmount").textContent +
            " tip, " +
            $("perPerson").textContent +
            " per person.";
          try {
            await navigator.clipboard.writeText(text);
            $("copy").textContent = "Copied ✓";
            setTimeout(function () {
              $("copy").textContent = "Copy summary";
            }, 1600);
          } catch (x) {
            $("error").textContent = "Clipboard access was blocked.";
          }
        };
        calculate();
      })();
