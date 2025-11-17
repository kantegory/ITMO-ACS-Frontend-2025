const recipeFormState = {
    mode: document.body.dataset.formMode || "create",
    recipeId: null,
    dictionaries: {
        dishTypes: [],
        difficulties: [],
        ingredients: [],
    },
    existingIngredientIds: [],
    existingStepNumbers: [],
};

document.addEventListener("DOMContentLoaded", () => {
    if (!requireAuthOrRedirect()) return;
    initRecipeForm().catch((error) => {
        console.error(error);
        showInlineMessage("recipeFormAlert", error.message || "Ошибка инициализации формы");
    });
});

async function initRecipeForm() {
    const recipeIdParam = getQueryParam("id");
    recipeFormState.recipeId = recipeFormState.mode === "edit" && recipeIdParam !== null
        ? Number(recipeIdParam)
        : null;

    if (recipeFormState.mode === "edit" && (!Number.isInteger(recipeFormState.recipeId) || recipeFormState.recipeId <= 0)) {
        showInlineMessage("recipeFormAlert", "Не указан идентификатор рецепта для редактирования.");
        return;
    }

    await loadDictionaries();
    populateDictionaries();
    setupDynamicSections();

    if (recipeFormState.mode === "edit") {
        await populateFormForEdit();
    } else {
        addIngredientRow();
        addStepRow();
    }

    const form = document.getElementById("recipeForm");
    if (form) form.addEventListener("submit", handleRecipeFormSubmit);
}

async function loadDictionaries() {
    const [dishTypesResponse, difficultyResponse, ingredientsResponse] = await Promise.all([
        sendJsonRequest(`${API_BASE.RECIPE}/dish-type`),
        sendJsonRequest(`${API_BASE.RECIPE}/recipe-difficulty`),
        sendJsonRequest(`${API_BASE.RECIPE}/ingredient`),
    ]);

    if (!dishTypesResponse.ok || !difficultyResponse.ok || !ingredientsResponse.ok) {
        throw new Error("Не удалось загрузить справочные данные.");
    }

    recipeFormState.dictionaries.dishTypes = dishTypesResponse.data ?? [];
    recipeFormState.dictionaries.difficulties = difficultyResponse.data ?? [];
    recipeFormState.dictionaries.ingredients = ingredientsResponse.data ?? [];
}

function populateDictionaries() {
    fillSelect("dishTypeSelect", recipeFormState.dictionaries.dishTypes, "Выберите тип блюда");
    fillSelect("difficultySelect", recipeFormState.dictionaries.difficulties, "Сложность");
}

function fillSelect(selectId, items, placeholder) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = `<option value="">${placeholder}</option>`;
    items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.innerText = item.name;
        select.appendChild(option);
    });
}

function setupDynamicSections() {
    document.getElementById("addIngredientButton").addEventListener("click", () => addIngredientRow());
    document.getElementById("addStepButton").addEventListener("click", () => addStepRow());
}

function addIngredientRow(initialData = null) {
    const container = document.getElementById("ingredientsRows");
    const row = document.createElement("div");
    row.className = "ingredient-row";
    row.innerHTML = `
        <div class="row g-3 align-items-end">
            <div class="col-md-5">
                <label class="form-label">Ингредиент</label>
                <select class="form-select ingredient-select" required>
                    <option value="">Выберите</option>
                    ${recipeFormState.dictionaries.ingredients.map((ingredient) => `
                        <option value="${ingredient.id}">${ingredient.name}</option>
                    `).join("")}
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">Количество</label>
                <input type="number" class="form-control ingredient-quantity" min="0.1" step="0.1" required>
            </div>
            <div class="col-md-3">
                <label class="form-label">Единица измерения</label>
                <input type="text" class="form-control ingredient-unit" required>
            </div>
            <div class="col-md-1 text-end">
                <button type="button" class="btn btn-outline-danger" aria-label="Удалить">
                    &times;
                </button>
            </div>
        </div>
    `;
    row.querySelector("button").addEventListener("click", () => row.remove());
    if (initialData) {
        row.querySelector(".ingredient-select").value = initialData.ingredient?.id || "";
        row.querySelector(".ingredient-quantity").value = initialData.quantity;
        row.querySelector(".ingredient-unit").value = initialData.unit;
    }
    container.appendChild(row);
}

function addStepRow(initialData = null) {
    const container = document.getElementById("stepsRows");
    const row = document.createElement("div");
    row.className = "step-row";
    row.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <strong>Шаг</strong>
            <button type="button" class="btn btn-sm btn-outline-danger">&times;</button>
        </div>
        <div class="mb-3">
            <label class="form-label">Описание шага</label>
            <textarea class="form-control step-instruction" rows="3" required></textarea>
        </div>
    `;
    row.querySelector("button").addEventListener("click", () => row.remove());
    if (initialData) {
        row.querySelector(".step-instruction").value = initialData.instruction;
    }
    container.appendChild(row);
}

async function populateFormForEdit() {
    const response = await sendJsonRequest(`${API_BASE.RECIPE}/recipe/${recipeFormState.recipeId}`);
    if (!response.ok) {
        throw new Error(response.data?.message || "Не удалось загрузить рецепт.");
    }

    const recipe = response.data;
    document.getElementById("titleInput").value = recipe.title;
    document.getElementById("descriptionInput").value = recipe.description || "";
    document.getElementById("dishTypeSelect").value = recipe.dishType?.id || "";
    document.getElementById("difficultySelect").value = recipe.recipeDifficulty?.id || "";
    document.getElementById("prepTimeInput").value = recipe.preparation_time;
    document.getElementById("cookTimeInput").value = recipe.cooking_time;
    document.getElementById("servingsInput").value = recipe.servings;
    document.getElementById("imageInput").value = recipe.image || "";
    document.getElementById("videoInput").value = recipe.video || "";

    const ingredientsContainer = document.getElementById("ingredientsRows");
    ingredientsContainer.innerHTML = "";
    const ingredients = recipe.recipeIngredients ?? [];
    ingredients.forEach((ingredientEntry) => addIngredientRow(ingredientEntry));
    if (ingredients.length === 0) addIngredientRow();
    recipeFormState.existingIngredientIds = ingredients.map((entry) => entry.id);

    const stepsContainer = document.getElementById("stepsRows");
    stepsContainer.innerHTML = "";
    const steps = (recipe.steps ?? []).sort((a, b) => a.step_number - b.step_number);
    steps.forEach((step) => addStepRow(step));
    if (steps.length === 0) addStepRow();
    recipeFormState.existingStepNumbers = steps.map((step) => step.step_number);
}

async function handleRecipeFormSubmit(event) {
    event.preventDefault();
    hideInlineMessage("recipeFormAlert");

    const payload = recipeFormState.mode === "create"
        ? collectRecipePayloadForCreate()
        : collectRecipePayloadForEdit();

    if (!payload) return;

    const ingredientEntries = collectIngredientData();
    const stepEntries = collectStepData();
    if (ingredientEntries.length === 0) {
        showInlineMessage("recipeFormAlert", "Добавьте хотя бы один ингредиент.");
        return;
    }
    if (stepEntries.length === 0) {
        showInlineMessage("recipeFormAlert", "Добавьте хотя бы один шаг приготовления.");
        return;
    }

    const submitButton = document.getElementById("recipeSubmitButton");
    submitButton.disabled = true;
    submitButton.innerHTML = createLoadingPlaceholder("Сохраняем...");

    try {
        const endpoint = recipeFormState.mode === "create"
            ? `${API_BASE.RECIPE}/recipe`
            : `${API_BASE.RECIPE}/recipe/${recipeFormState.recipeId}`;
        const method = recipeFormState.mode === "create" ? "POST" : "PUT";

        const response = await sendJsonRequest(endpoint, method, payload);
        if (!response.ok) {
            throw new Error(response.data?.message || "Не удалось сохранить рецепт.");
        }

        const createdRecipe = response.data;
        const targetRecipeId = recipeFormState.mode === "create"
            ? createdRecipe?.id
            : recipeFormState.recipeId;

        if (!targetRecipeId) {
            throw new Error("Сервис не вернул идентификатор рецепта.");
        }

        await syncRecipeIngredients(targetRecipeId, ingredientEntries);
        await syncRecipeSteps(targetRecipeId, stepEntries);

        submitButton.disabled = false;
        submitButton.innerText = recipeFormState.mode === "create" ? "Создать рецепт" : "Сохранить изменения";
        showInlineMessage(
            "recipeFormAlert",
            `Рецепт успешно сохранен. <a href="recipe.html?id=${targetRecipeId}" class="alert-link">Открыть</a>`,
            "success",
        );
    } catch (error) {
        console.error(error);
        submitButton.disabled = false;
        submitButton.innerText = recipeFormState.mode === "create" ? "Создать рецепт" : "Сохранить изменения";
        showInlineMessage("recipeFormAlert", error.message || "Произошла ошибка. Попробуйте повторить.");
    }
}

async function sendOrThrow(url, method, body = null) {
    const response = await sendJsonRequest(url, method, body);
    if (!response.ok) {
        throw new Error(response.data?.message || "Запрос завершился с ошибкой.");
    }
    return response;
}

// Для создания нового рецепта
function collectRecipePayloadForCreate() {
    const title = document.getElementById("titleInput").value.trim();
    const dishTypeId = Number(document.getElementById("dishTypeSelect").value);
    const difficultyId = Number(document.getElementById("difficultySelect").value);
    const preparationTime = Number(document.getElementById("prepTimeInput").value);
    const cookingTime = Number(document.getElementById("cookTimeInput").value);
    const servings = Number(document.getElementById("servingsInput").value);

    if (!title || !dishTypeId || !difficultyId || !preparationTime || !cookingTime || !servings) {
        showInlineMessage("recipeFormAlert", "Пожалуйста, заполните обязательные поля.");
        return null;
    }

    return {
        title,
        description: document.getElementById("descriptionInput").value.trim() || null,
        dishTypeId,
        recipeDifficultyId: difficultyId,
        preparation_time: preparationTime,
        cooking_time: cookingTime,
        servings,
        image: document.getElementById("imageInput").value.trim() || null,
        video: document.getElementById("videoInput").value.trim() || null,
    };
}

// Для редактирования существующего рецепта
function collectRecipePayloadForEdit() {
    const title = document.getElementById("titleInput").value.trim();
    const dishTypeId = Number(document.getElementById("dishTypeSelect").value);
    const difficultyId = Number(document.getElementById("difficultySelect").value);
    const preparationTime = Number(document.getElementById("prepTimeInput").value);
    const cookingTime = Number(document.getElementById("cookTimeInput").value);
    const servings = Number(document.getElementById("servingsInput").value);

    if (!title || !dishTypeId || !difficultyId || !preparationTime || !cookingTime || !servings) {
        showInlineMessage("recipeFormAlert", "Пожалуйста, заполните обязательные поля.");
        return null;
    }

    return {
        title,
        description: document.getElementById("descriptionInput").value.trim() || null,
        dishType: { id: dishTypeId },
        recipeDifficulty: { id: difficultyId },
        preparation_time: preparationTime,
        cooking_time: cookingTime,
        servings,
        image: document.getElementById("imageInput").value.trim() || null,
        video: document.getElementById("videoInput").value.trim() || null,
    };
}

function collectIngredientData() {
    const rows = document.querySelectorAll(".ingredient-row");
    return Array.from(rows).map((row) => ({
        ingredientId: Number(row.querySelector(".ingredient-select").value),
        quantity: Number(row.querySelector(".ingredient-quantity").value),
        unit: row.querySelector(".ingredient-unit").value.trim(),
    })).filter((entry) => entry.ingredientId && entry.quantity && entry.unit);
}

function collectStepData() {
    const rows = document.querySelectorAll(".step-row");
    return Array.from(rows).map((row, index) => ({
        step_number: index + 1,
        instruction: row.querySelector(".step-instruction").value.trim(),
    })).filter((entry) => entry.instruction);
}

async function syncRecipeIngredients(recipeId, entries) {
    if (recipeFormState.mode === "edit" && recipeFormState.existingIngredientIds.length) {
        for (const id of recipeFormState.existingIngredientIds) {
            await sendOrThrow(`${API_BASE.RECIPE}/recipe-ingredient/${recipeId}/${id}`, "DELETE");
        }
    }

    const newIngredientIds = [];
    for (const entry of entries) {
        const response = await sendOrThrow(`${API_BASE.RECIPE}/recipe-ingredient/${recipeId}`, "POST", entry);
        if (response.data?.id) {
            newIngredientIds.push(response.data.id);
        }
    }
    recipeFormState.existingIngredientIds = newIngredientIds;
}

async function syncRecipeSteps(recipeId, steps) {
    if (recipeFormState.mode === "edit" && recipeFormState.existingStepNumbers.length) {
        for (const stepNumber of recipeFormState.existingStepNumbers) {
            await sendOrThrow(`${API_BASE.RECIPE}/recipe-step/${recipeId}/${stepNumber}`, "DELETE");
        }
    }

    for (const step of steps) {
        await sendOrThrow(`${API_BASE.RECIPE}/recipe-step/${recipeId}`, "POST", step);
    }
    recipeFormState.existingStepNumbers = steps.map((step) => step.step_number);
}

