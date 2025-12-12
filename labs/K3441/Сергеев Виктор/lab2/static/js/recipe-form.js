const recipeFormState = {
    mode: document.body.dataset.formMode || "create",
    recipeId: null,
    dictionaries: {
        tags: [],
        ingredients: [],
    },
    user_id: null,
    existingIngredientIds: [],
    existingRecipeIngredientIds: [],
    existingTagIds: [],
    existingRecipeTagIds: [],
    existingRecipeStepNumbers: [],
    existingRecipeStepIds: [],
};

document.addEventListener("DOMContentLoaded", () => {
    if (!requireAuthOrRedirect()) return;
    initRecipeForm().catch((error) => {
        console.error(error);
        showInlineMessage("recipeFormAlert", error.message || "Ошибка инициализации формы");
    });
});

async function initRecipeForm() {
    const currentUser = await fetchCurrentUser()
    recipeFormState.user_id = currentUser.id;

    const recipeIdParam = getQueryParam("id");
    recipeFormState.recipeId = recipeFormState.mode === "edit" && recipeIdParam !== null
        ? Number(recipeIdParam)
        : null;

    if (recipeFormState.mode === "edit" && (!Number.isInteger(recipeFormState.recipeId) || recipeFormState.recipeId <= 0)) {
        showInlineMessage("recipeFormAlert", "Не указан идентификатор рецепта для редактирования.");
        return;
    }

    await loadDictionaries();
    setupDynamicSections();

    if (recipeFormState.mode === "edit") {
        await populateFormForEdit();
    } else {
        addIngredientRow();
        addTagRow();
        addStepRow();
    }

    const form = document.getElementById("recipeForm");
    if (form) form.addEventListener("submit", handleRecipeFormSubmit);
}

async function loadDictionaries() {
    const [tagsResponse, ingredientsResponse] = await Promise.all([
        sendRequest(`${BACKEND_URL}/api/tag`),
        sendRequest(`${BACKEND_URL}/api/ingredient`),
    ]);

    if (!tagsResponse.success || !ingredientsResponse.success) {
        throw new Error("Не удалось загрузить справочные данные.");
    }

    recipeFormState.dictionaries.tags = tagsResponse.data ?? [];
    recipeFormState.dictionaries.ingredients = ingredientsResponse.data ?? [];
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
    document.getElementById("addTagButton").addEventListener("click", () => addTagRow());
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
                <input type="number" class="form-control ingredient-amount" min="0.1" step="0.1" required>
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
        row.querySelector(".ingredient-amount").value = initialData.amount;
        row.querySelector(".ingredient-unit").value = initialData.unit;
    }
    container.appendChild(row);
}

function addTagRow(initialData = null) {
    const container = document.getElementById("tagsRows");
    const row = document.createElement("div");
    row.className = "tag-row";
    row.innerHTML = `
        <div class="row g-3 align-items-end">
            <div class="col-md-5">
                <label class="form-label">Тег</label>
                <select class="form-select tag-select" required>
                    <option value="">Выберите</option>
                    ${recipeFormState.dictionaries.tags.map((tag) => `
                        <option value="${tag.id}">${tag.name}</option>
                    `).join("")}
                </select>
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
        row.querySelector(".tag-select").value = initialData.tag?.id || "";
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
    const [recipeResponse, tagsResponse, ingredientsResponse, stepsResponse] = await Promise.all([
        sendRequest(`${BACKEND_URL}/api/recipe/${recipeFormState.recipeId}`),
        sendRequest(`${BACKEND_URL}/api/recipetag/?recipe_id=${recipeFormState.recipeId}`),
        sendRequest(`${BACKEND_URL}/api/recipeingredient/?recipe_id=${recipeFormState.recipeId}`),
        sendRequest(`${BACKEND_URL}/api/recipestep/?recipe_id=${recipeFormState.recipeId}`)
    ]);

    if (!recipeResponse.success || !tagsResponse.success ||
            !ingredientsResponse.success || !stepsResponse.success) {
        throw new Error("Ошибка загрузки рецепта");
    }

    const recipe = recipeResponse.data;
    const ingredients = ingredientsResponse.data ?? [];
    const tags = tagsResponse.data ?? [];
    const steps = (stepsResponse.data ?? []).sort((a, b) => a.step_number - b.step_number);
    document.getElementById("titleInput").value = recipe.title;
    document.getElementById("descriptionInput").value = recipe.description || "";
    document.getElementById("difficultyInput").value = recipe.difficulty || 1;
    document.getElementById("cookTimeInput").value = recipe.cooking_time;
    document.getElementById("imageInput").value = recipe.image_url || "";
    document.getElementById("videoInput").value = recipe.video_url || "";

    const ingredientsContainer = document.getElementById("ingredientsRows");
    ingredientsContainer.innerHTML = "";
    ingredients.forEach((ingredientEntry) => addIngredientRow(ingredientEntry));
    if (ingredients.length === 0) addIngredientRow();
    recipeFormState.existingIngredientIds = ingredients.map((entry) => entry.ingredient.id);
    recipeFormState.existingRecipeIngredientIds = ingredients.map((entry) => entry.id);

    const tagsContainter = document.getElementById("tagsRows");
    tagsContainter.innerHTML = "";
    tags.forEach((tagEntry) => addTagRow(tagEntry));
    if (tags === 0) addTagRow();
    recipeFormState.existingTagIds = tags.map((entry) => entry.tag.id);
    recipeFormState.existingRecipeTagIds = tags.map((entry) => entry.id)

    const stepsContainer = document.getElementById("stepsRows");
    stepsContainer.innerHTML = "";
    steps.forEach((step) => addStepRow(step));
    if (steps.length === 0) addStepRow();
    recipeFormState.existingRecipeStepIds = steps.map((step) => step.id);
    recipeFormState.existingRecipeStepNumbers = steps.map((step) => step.step_number)
}

async function handleRecipeFormSubmit(event) {
    event.preventDefault();
    hideInlineMessage("recipeFormAlert");

    const payload = collectRecipePayload();

    if (!payload) return;

    const ingredientEntries = collectIngredientData();
    const tagsEntries = collectTagsData();
    const stepEntries = collectStepData();
    if (ingredientEntries.length === 0) {
        showInlineMessage("recipeFormAlert", "Добавьте хотя бы один ингредиент.");
        return;
    }

    if (tagsEntries.length === 0) {
        showInlineMessage("recipeFormAlert", "Добавьте хотя бы один тег");
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
            ? `${BACKEND_URL}/api/recipe`
            : `${BACKEND_URL}/api/recipe/${recipeFormState.recipeId}`;
        const method = recipeFormState.mode === "create" ? "POST" : "PATCH";

        const response = await sendRequest(endpoint, method, payload);
        if (!response.success) {
            throw new Error(response.error || "Не удалось сохранить рецепт.");
        }

        const createdRecipe = response.data;
        const targetRecipeId = recipeFormState.mode === "create"
            ? createdRecipe?.id
            : recipeFormState.recipeId;

        if (!targetRecipeId) {
            throw new Error("Сервис не вернул идентификатор рецепта.");
        }

        await syncRecipeIngredients(targetRecipeId, ingredientEntries);
        await syncRecipeTags(targetRecipeId, tagsEntries)
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
    const response = await sendRequest(url, method, body);
    if (!response.success) {
        throw new Error(response.error || "Запрос завершился с ошибкой.");
    }
    return response;
}

function collectRecipePayload() {
    const title = document.getElementById("titleInput").value.trim();
    const difficulty = Number(document.getElementById("difficultyInput").value);
    const cookingTime = Number(document.getElementById("cookTimeInput").value);

    if (!title || !difficulty || !cookingTime) {
        showInlineMessage("recipeFormAlert", "Пожалуйста, заполните обязательные поля.");
        return null;
    }

    return {
        title,
        description: document.getElementById("descriptionInput").value.trim() || null,
        difficulty,
        cooking_time: cookingTime,
        image_url: document.getElementById("imageInput").value.trim() || null,
        video_url: document.getElementById("videoInput").value.trim() || null,
        author_id: recipeFormState.user_id,
    };
}

function collectIngredientData() {
    const rows = document.querySelectorAll(".ingredient-row");
    return Array.from(rows).map((row) => ({
        ingredient_id: Number(row.querySelector(".ingredient-select").value),
        amount: Number(row.querySelector(".ingredient-amount").value),
        unit: row.querySelector(".ingredient-unit").value.trim(),
    })).filter((entry) => entry.ingredient_id && entry.amount && entry.unit);
}

function collectTagsData() {
    const rows = document.querySelectorAll(".tag-row");
    return Array.from(rows).map((row) => ({
        tag_id: Number(row.querySelector(".tag-select").value),
    })).filter((entry) => entry.tag_id);
}

function collectStepData() {
    const rows = document.querySelectorAll(".step-row");
    return Array.from(rows).map((row, index) => ({
        step_number: index + 1,
        instruction: row.querySelector(".step-instruction").value.trim(),
    })).filter((entry) => entry.step_number && entry.instruction);
}

async function syncRecipeIngredients(recipeId, entries) {
    if (recipeFormState.mode === "edit" && recipeFormState.existingIngredientIds.length) {
        for (const id of recipeFormState.existingRecipeIngredientIds) {
            await sendOrThrow(`${BACKEND_URL}/api/recipeingredient/${id}`, "DELETE");
        }
    }

    const newIngredientIds = [];
    const newRecipeIngredientIds = [];
    for (const entry of entries) {
        entry.recipe_id = recipeId;
        const response = await sendOrThrow(`${BACKEND_URL}/api/recipeingredient/`, "POST", entry);
        if (response.data?.id) {
            newIngredientIds.push(response.data.ingredient.id);
            newRecipeIngredientIds.push(response.data.id);
        }
    }
    recipeFormState.existingIngredientIds = newIngredientIds;
    recipeFormState.existingRecipeIngredientIds = newRecipeIngredientIds;
}

async function syncRecipeTags(recipeId, entries) {
    if (recipeFormState.mode === "edit" && recipeFormState.existingRecipeTagIds.length) {
        for (const id of recipeFormState.existingRecipeTagIds) {
            await sendOrThrow(`${BACKEND_URL}/api/recipetag/${id}`, "DELETE");
        }
    }

    const newTagIds = [];
    const newRecipeTagIds = [];
    for (const entry of entries) {
        entry.recipe_id = recipeId;
        const response = await sendOrThrow(`${BACKEND_URL}/api/recipetag/`, "POST", entry);
        if (response.data?.id) {
            newTagIds.push(response.data.tag.id);
            newRecipeTagIds.push(response.data.id);
        }
    }
    recipeFormState.existingTagIds = newTagIds;
    recipeFormState.existingRecipeTagIds = newRecipeTagIds;
}

async function syncRecipeSteps(recipeId, steps) {
    if (recipeFormState.mode === "edit" && recipeFormState.existingRecipeStepNumbers.length) {
        for (const id of recipeFormState.existingRecipeStepIds) {
            await sendOrThrow(`${BACKEND_URL}/api/recipestep/${id}`, "DELETE");
        }
    }

    const newRecipeStepNumbers = [];
    const newRecipeStepIds = [];
    for (const step of steps) {
        step.recipe_id = recipeId;
        const response = await sendOrThrow(`${BACKEND_URL}/api/recipestep/`, "POST", step);
        if (response.data?.id) {
            newRecipeStepNumbers.push(response.data.step_number);
            newRecipeStepIds.push(response.data.id);
        }
    }
    recipeFormState.existingRecipeStepNumbers = newRecipeStepNumbers;
    recipeFormState.existingRecipeStepIds = newRecipeStepIds;
}