(() => {
  "use strict";
  var e = {
    d: (n, t) => {
      for (var o in t)
        e.o(t, o) &&
          !e.o(n, o) &&
          Object.defineProperty(n, o, { enumerable: !0, get: t[o] });
    },
    o: (e, n) => Object.prototype.hasOwnProperty.call(e, n),
  };
  e.d({}, { j: () => t });
  class n {
    constructor(e, n, t, o) {
      (this.title = e),
        (this.description = n),
        (this.dueDate = t),
        (this.priority = o);
    }
  }
  const t = [];
  (document.getElementById("newTask").onclick = function (e) {}),
    (function (e, o, i, r) {
      const c = new n("gym", "training", "tomorrow", "high");
      t.push(c);
      const d = document.getElementById("content"),
        s = document.createElement("div");
      (s.innerHTML =
        "\n<p>Title:undefined</p>\n<p>description:undefined</p>\n<p>dueDate:undefined</p>\n<p>priority:undefined</p>\n"),
        d.appendChild(s);
    })(),
    console.log("Hello!");
  let o = new n("gym", "crossfit", "tomorrow", "high");
  t.push("taskOne"), console.log(o);
})();
