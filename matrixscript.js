function generateMatrices() {
    const rowsA = parseInt(document.getElementById('rows1').value);
    const colsA = parseInt(document.getElementById('cols1').value);
    const rowsB = parseInt(document.getElementById('rows2').value);
    const colsB = parseInt(document.getElementById('cols2').value);

    generateMatrixInputs('matrixA', 'A', rowsA, colsA);
    generateMatrixInputs('matrixB', 'B', rowsB, colsB);
}

function generateMatrixInputs(containerId, matrixName, rows, cols) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<h2>Matrix ${matrixName}</h2>`;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const inputId = `${matrixName}${i}_${j}`;
            container.innerHTML += `<input type="number" id="${inputId}" class="matrix-input" value=''>`;
        }
        container.innerHTML += '<br>';
    }

    const inputs = container.querySelectorAll('.matrix-input');
    inputs.forEach(input => {
        input.style.width = '50px';
        input.style.height = '30px';
        input.style.textAlign = 'center';
        input.style.margin = '0px';
        input.style.padding = '0px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        input.style.fontSize = '14px';
        input.style.MozAppearance = 'textfield';
        input.style.WebkitAppearance = 'none';
        input.style.backgroundColor = '#2b2b2b';
        input.style.color = '#fff';
    });
}

function getMatrixValues(matrixName) {
    const rows1 = parseInt(document.getElementById('rows1').value);
    const cols1 = parseInt(document.getElementById('cols1').value);
    const rows2 = parseInt(document.getElementById('rows2').value);
    const cols2 = parseInt(document.getElementById('cols2').value);

    const matrix = [];

    if (matrixName === "A") {
        for (let i = 0; i < rows1; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols1; j++) {
                const inputId = `${matrixName}${i}_${j}`;
                matrix[i][j] = parseFloat(document.getElementById(inputId).value) || 0;
            }
        }
    } else if (matrixName === "B") {
        for (let i = 0; i < rows2; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols2; j++) {
                const inputId = `${matrixName}${i}_${j}`;
                matrix[i][j] = parseFloat(document.getElementById(inputId).value) || 0;
            }
        }
    }

    return matrix;
}

function clearMatrix() {
    clearMatrixInputs('A');
    clearMatrixInputs('B');
    document.getElementById('result').innerHTML = '';
}

function clearMatrixInputs(matrixName) {
    const rowsInput = parseInt(document.getElementById(`rows${matrixName === 'A' ? '1' : '2'}`).value);
    const colsInput = parseInt(document.getElementById(`cols${matrixName === 'A' ? '1' : '2'}`).value);

    for (let i = 0; i < rowsInput; i++) {
        for (let j = 0; j < colsInput; j++) {
            const inputId = `${matrixName}${i}_${j}`;
            const inputElement = document.getElementById(inputId);

            if (inputElement) {
                inputElement.value = ''; 
            } else {
                console.error(`Element with id ${inputId} not found.`);
            }
        }
    }
}

function addMatrices() {
    performMatrixOperation((a, b) => a + b, 'Addition');
}

function subtractMatrices() {
    performMatrixOperation((a, b) => a - b, 'Subtraction');
}

function multiplyMatrices() {
    const rowsA = parseInt(document.getElementById('rows1').value);
    const colsA = parseInt(document.getElementById('cols1').value);
    const rowsB = parseInt(document.getElementById('rows2').value);
    const colsB = parseInt(document.getElementById('cols2').value);

    const matrixA = getMatrixValues('A', rowsA, colsA);
    const matrixB = getMatrixValues('B', rowsB, colsB);

    if (colsA !== rowsB) {
        alert('Matrix multiplication is not defined. Number of columns in A must be equal to the number of rows in B.');
        return;
    }

    const result = [];
    for (let i = 0; i < rowsA; i++) {
        result[i] = [];
        for (let j = 0; j < colsB; j++) {
            result[i][j] = 0;
            for (let k = 0; k < colsA; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }

    displayMatrixResult(result, 'Multiplication');
}

function performMatrixOperation(operation, operationName) {
    const matrixA = getMatrixValues('A');
    const matrixB = getMatrixValues('B');

    const result = matrixA.map((row, i) => row.map((value, j) => operation(value, matrixB[i][j])));

    displayMatrixResult(result, operationName);
}

function determinantMatrix(matrix) {
    if (matrix.length !== matrix[0].length) {
        alert('The matrix must be square for determinant calculation.');
        return;
    }

    if (matrix.length === 1) {
        return matrix[0][0];
    }

    if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    let det = 0;
    for (let i = 0; i < matrix.length; i++) {
        det += matrix[0][i] * cofactor(matrix, 0, i);
    }

    return det;
}

function cofactor(matrix, row, col) {
    return Math.pow(-1, row + col) * minor(matrix, row, col);
}

function minor(matrix, row, col) {
    const submatrix = matrix
        .filter((_, i) => i !== row)
        .map(row => row.filter((_, j) => j !== col));

    return determinantMatrix(submatrix);
}

function inverseMatrix(matrixName) {
    const matrix = getMatrixValues(matrixName);
    const det = determinantMatrix(matrix);

    if (det === 0) {
        alert('The matrix is singular, and its inverse does not exist.');
        return;
    }

    const adjugate = matrix.map((row, i) =>
        row.map((_, j) => cofactor(matrix, i, j))
    );

    const tes1 = adjugate.map(row =>
        row.map(value => value / det)
    );
    
    const inverse = transposeMatrix(tes1);
    return inverse;
}


function transposeMatrix(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

function displayScalarResult(result, operationName) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `<h2>${operationName}</h2>`;
    const p = document.createElement('p');
    p.textContent = result;
    resultContainer.appendChild(p);
}   

function determinantMatrixA() {
    const matrixA = getMatrixValues('A');
    const detA = determinantMatrix(matrixA);
    displayScalarResult(detA, 'Determinant of A');
}

function inverseMatrixA() {
    const inverseA = inverseMatrix('A');
    displayMatrixResult(inverseA, 'Inverse of A');
}

function inverseMatrixB() {
    const inverseB = inverseMatrix('B');
    displayMatrixResult(inverseB, 'Inverse of B');
}


function transposeMatrixA() {
    const matrixA = getMatrixValues('A');
    const transposedA = transposeMatrix(matrixA);
    displayMatrixResult(transposedA, 'Transpose of A');
}

function determinantMatrixB() {
    const matrixB = getMatrixValues('B');
    const detB = determinantMatrix(matrixB);
    displayScalarResult(detB, 'Determinant of B');
}

function transposeMatrixB() {
    const matrixB = getMatrixValues('B');
    const transposedB = transposeMatrix(matrixB);
    displayMatrixResult(transposedB, 'Transpose of B');
}

function powerOfMatrixA() {
    const power = parseInt(document.getElementById('powerOfInputA').value);
    const matrixA = getMatrixValues('A');
    const result = powerMatrix(matrixA, power);
    displayMatrixResult(result, "Power of Matrix A");
}

function powerOfMatrixB() {
    const power = parseInt(document.getElementById('powerOfInputB').value);
    const matrixB = getMatrixValues('B');
    const result = powerMatrix(matrixB, power);
    displayMatrixResult(result, "Power of Matrix B");
}

function multiplyByMatrixA() {
    const scalar = parseInt(document.getElementById('multiplyByInputA').value);
    const matrixA = getMatrixValues('A');
    const result = scalarMultiply(matrixA, scalar);
    displayMatrixResult(result, "Scalar");
}

function multiplyByMatrixB() {
    const scalar = parseInt(document.getElementById('multiplyByInputB').value);
    const matrixB = getMatrixValues('B');
    const result = scalarMultiply(matrixB, scalar);
    displayMatrixResult(result, "Scalar");
}

function powerMatrix(matrix, power) {
    if (power === 0) {
        return getIdentityMatrix(matrix.length);
    } 
    let result = matrix;
    for (let i = 1; i < power; i++) {
        result = multiplyMatricesPower(result, matrix);
    }
    return result;
}

function multiplyMatricesPower(matrixA, matrixB) {
    const result = [];

    for (let i = 0; i < matrixA.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrixB[0].length; j++) {
            result[i][j] = 0;
            for (let k = 0; k < matrixA[0].length; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }
    return result;
}

function getIdentityMatrix(size) {
    const identityMatrix = [];

    for (let i = 0; i < size; i++) {
        identityMatrix[i] = [];
        for (let j = 0; j < size; j++) {
            identityMatrix[i][j] = i === j ? 1 : 0;
        }
    }

    return identityMatrix;
}

function scalarMultiply(matrix, scalar) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return matrix; // Return the input matrix if it's empty
    }

    return matrix.map(row => row.map(value => value * scalar));
}


function displayMatrixResult(matrix, operationName) {
    const resultContainer = document.getElementById('result');

    resultContainer.innerHTML = '';

    const newResultContainer = document.createElement('div');
    newResultContainer.innerHTML = `<h2>${operationName}</h2>`;

    const table = document.createElement('table');
    for (let i = 0; i < matrix.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < matrix[0].length; j++) {
            const cell = document.createElement('td');
            cell.textContent = matrix[i][j];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    newResultContainer.appendChild(table);
    resultContainer.appendChild(newResultContainer);
}

function gaussianElimination(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    for (let i = 0; i < rows; i++) {

        let pivotRow = i;
        for (let j = i + 1; j < rows; j++) {
            if (Math.abs(matrix[j][i]) > Math.abs(matrix[pivotRow][i])) {
                pivotRow = j;
            }
        }

        // Swap rows only if the pivot element is non-zero
        if (matrix[pivotRow][i] !== 0) {
            [matrix[i], matrix[pivotRow]] = [matrix[pivotRow], matrix[i]];

            const pivot = matrix[i][i];
            for (let j = i; j < cols; j++) {
                matrix[i][j] /= pivot;
            }

            for (let j = 0; j < rows; j++) {
                if (j !== i) {
                    const factor = matrix[j][i];
                    for (let k = i; k < cols; k++) {
                        matrix[j][k] -= factor * matrix[i][k];
                    }
                }
            }
        }
    }

    return matrix;
}


function findMatrixRank(matrix) {
    const rowEchelonForm = gaussianElimination(matrix);

    let rank = 0;
    for (let i = 0; i < rowEchelonForm.length; i++) {
        if (rowEchelonForm[i].some(element => element !== 0)) {
            rank++;
        }
    }

    return rank;
}

function RankMatrixA(){
    const matrixA = getMatrixValues('A');
    const result = findMatrixRank(matrixA);
    displayScalarResult(result, "Rank of Matrix A")
}

function RankMatrixB(){
    const matrixA = getMatrixValues('B');
    const result = findMatrixRank(matrixA);
    displayScalarResult(result, "Rank of Matrix B")
}

function traceMatrixA(){
    const matrixA = getMatrixValues('A');
    const result = findMatrixTrace(matrixA);
    displayScalarResult(result, "Trace of Matrix A");
}

function traceMatrixB(){
    const matrixB = getMatrixValues('B');
    const result = findMatrixTrace(matrixB);
    displayScalarResult(result, "Trace of Matrix B");
}

function findMatrixTrace(matrix){
    if (matrix.length === 0 || matrix[0].length === 0 || matrix.length !== matrix[0].length) {
        alert('Invalid matrix for trace calculation.');
        return;
    }

    let trace = 0;
    for (let i = 0; i < matrix.length; i++) {
        trace += matrix[i][i];
    }

    return trace;
}

generateMatrices();

