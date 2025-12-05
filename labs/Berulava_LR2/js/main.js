document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-container, .glass-card').forEach(el => {
    observer.observe(el);
});

function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });

    return isValid;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'glass-container position-fixed top-0 end-0 m-3';
    toast.style.zIndex = '9999';
    toast.style.minWidth = '300px';
    
    let icon = 'info-circle';
    let color = '#4facfe';
    
    if (type === 'success') {
        icon = 'check-circle';
        color = '#00f2fe';
    } else if (type === 'error') {
        icon = 'exclamation-circle';
        color = '#f5576c';
    }
    
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${icon}" style="font-size: 1.5rem; color: ${color}; margin-right: 1rem;"></i>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close ms-2" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'globalLoader';
    loader.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
    loader.style.background = 'rgba(0, 0, 0, 0.5)';
    loader.style.zIndex = '9999';
    loader.innerHTML = '<div class="spinner-glass"></div>';
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.remove();
    }
}

const Storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage', e);
        }
    },
    
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return null;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage', e);
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing localStorage', e);
        }
    }
};

const RecipeData = {
    getSavedRecipes: () => {
        return Storage.get('savedRecipes') || [];
    },
    
    saveRecipe: (recipeId) => {
        const saved = RecipeData.getSavedRecipes();
        if (!saved.includes(recipeId)) {
            saved.push(recipeId);
            Storage.set('savedRecipes', saved);
            showToast('Рецепт сохранен!', 'success');
            return true;
        }
        return false;
    },
    
    removeSavedRecipe: (recipeId) => {
        let saved = RecipeData.getSavedRecipes();
        saved = saved.filter(id => id !== recipeId);
        Storage.set('savedRecipes', saved);
        showToast('Рецепт удален из сохраненных', 'info');
    },
    
    isRecipeSaved: (recipeId) => {
        return RecipeData.getSavedRecipes().includes(recipeId);
    },
    
    getLikedRecipes: () => {
        return Storage.get('likedRecipes') || [];
    },
    
    likeRecipe: (recipeId) => {
        const liked = RecipeData.getLikedRecipes();
        if (!liked.includes(recipeId)) {
            liked.push(recipeId);
            Storage.set('likedRecipes', liked);
            return true;
        }
        return false;
    },
    
    unlikeRecipe: (recipeId) => {
        let liked = RecipeData.getLikedRecipes();
        liked = liked.filter(id => id !== recipeId);
        Storage.set('likedRecipes', liked);
    },
    
    isRecipeLiked: (recipeId) => {
        return RecipeData.getLikedRecipes().includes(recipeId);
    }
};

const Auth = {
    isLoggedIn: () => {
        return Storage.get('isLoggedIn') === true;
    },
    
    login: (email, password) => {
        if (email && password) {
            Storage.set('isLoggedIn', true);
            Storage.set('userEmail', email);
            return true;
        }
        return false;
    },
    
    logout: () => {
        Storage.set('isLoggedIn', false);
        Storage.remove('userEmail');
        window.location.href = 'index.html';
    },
    
    getCurrentUser: () => {
        if (Auth.isLoggedIn()) {
            return {
                email: Storage.get('userEmail'),
                name: 'Иван Иванов'
            };
        }
        return null;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes} мин`;
    } else {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
    }
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Скопировано в буфер обмена!', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            showToast('Ошибка копирования', 'error');
        });
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Скопировано в буфер обмена!', 'success');
        } catch (err) {
            console.error('Failed to copy:', err);
            showToast('Ошибка копирования', 'error');
        }
        document.body.removeChild(textArea);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});

window.RecipeApp = {
    showToast,
    showLoader,
    hideLoader,
    Storage,
    RecipeData,
    Auth,
    copyToClipboard,
    formatTime,
    formatNumber,
    debounce,
    validateForm
};

console.log('Recipe Website initialized successfully!');
