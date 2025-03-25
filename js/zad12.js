function buildDNF() {
    const vector = document.getElementById('vectorInput').value.trim();
    const n = vector.length;

    // Проверка корректности вектора
    if (!/^[01]+$/.test(vector)) {
        alert('Вектор должен содержать только 0 и 1');
        return;
    }

    if (n === 0 || (n & (n - 1)) !== 0) {
        alert('Длина вектора должна быть степенью двойки');
        return;
    }

    const numVars = Math.log2(n);
    if (numVars % 1 !== 0) {
        alert('Некорректная длина вектора');
        return;
    }

    // Получение конституент единицы
    const ones = [];
    for (let i = 0; i < n; i++) {
        if (vector[i] === '1') ones.push(i);
    }

    // Преобразование в бинарные термы
    const terms = ones.map(idx => {
        const bin = idx.toString(2).padStart(numVars, '0').split('').map(Number);
        return bin;
    });

    // Функция склейки термов
    const combineTerms = (terms) => {
        const combined = [];
        const covered = new Array(terms.length).fill(false);

        for (let i = 0; i < terms.length; i++) {
            for (let j = i + 1; j < terms.length; j++) {
                let diffIndex = -1;
                let canCombine = true;

                for (let k = 0; k < terms[i].length; k++) {
                    if (terms[i][k] !== terms[j][k]) {
                        if (diffIndex !== -1) {
                            canCombine = false;
                            break;
                        }
                        diffIndex = k;
                    }
                }

                if (canCombine && diffIndex !== -1) {
                    const newTerm = [...terms[i]];
                    newTerm[diffIndex] = -1;
                    combined.push(newTerm);
                    covered[i] = true;
                    covered[j] = true;
                }
            }
        }

        // Добавление непокрытых термов
        covered.forEach((isCovered, index) => {
            if (!isCovered) combined.push(terms[index]);
        });

        return combined;
    };

    // Минимизация (повторная склейка)
    let currentTerms = terms;
    let prevTerms;
    do {
        prevTerms = currentTerms;
        currentTerms = combineTerms(currentTerms);
    } while (currentTerms.length !== prevTerms.length);

    // Удаление дубликатов
    const uniqueImplicants = currentTerms.filter((term, index, self) =>
        self.findIndex(t => t.every((val, idx) => val === term[idx])) === index
    );

    // Жадный алгоритм для покрытия
    const remainingTerms = ones.map(idx =>
        idx.toString(2).padStart(numVars, '0')
    );
    const minimalImplicants = [];

    while (remainingTerms.length > 0) {
        let bestImplicant;
        let maxCover = 0;

        uniqueImplicants.forEach(implicant => {
            let coverCount = 0;
            remainingTerms.forEach(term => {
                let match = true;
                for (let i = 0; i < implicant.length; i++) {
                    if (implicant[i] !== -1 && implicant[i] !== parseInt(term[i])) {
                        match = false;
                        break;
                    }
                }
                if (match) coverCount++;
            });

            if (coverCount > maxCover) {
                maxCover = coverCount;
                bestImplicant = implicant;
            }
        });

        if (bestImplicant) {
            minimalImplicants.push(bestImplicant);
            // Удаление покрытых термов
            for (let i = remainingTerms.length - 1; i >= 0; i--) {
                let match = true;
                for (let j = 0; j < bestImplicant.length; j++) {
                    if (bestImplicant[j] !== -1 &&
                        bestImplicant[j] !== parseInt(remainingTerms[i][j])) {
                        match = false;
                        break;
                    }
                }
                if (match) remainingTerms.splice(i, 1);
            }
        } else break;
    }

    // Форматирование результата
    const dnf = minimalImplicants.map(imp => {
        const vars = imp.map((val, idx) => {
            const variable = `x${idx + 1}`;
            if (val === 0) return `<span style="text-decoration: overline">${variable}</span>`;
            if (val === 1) return variable;
            return null;
        }).filter(v => v !== null).join(' ∧ ');

        return vars ? `(${vars})` : '⊤';
    }).join(' ∨ ') || '<span style="color:red">⊥</span>';

    // Обработка тривиальных случаев
    let finalDnf = dnf;
    if (vector === '1'.repeat(n)) finalDnf = '1';
    if (vector === '0'.repeat(n)) finalDnf = '0';

    // Вывод
    document.getElementById('result').innerHTML = `
        <div style="font-size: 18px; margin-top: 10px;">
            Минимальная ДНФ: ${finalDnf}
        </div>
    `;
}