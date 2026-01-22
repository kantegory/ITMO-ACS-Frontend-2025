(() => {
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const jobsList = document.getElementById('jobsList');
  if (jobsList) {
    const items = Array.from(jobsList.querySelectorAll('.job-item'));
    const industrySelect = document.getElementById('filterIndustry');
    const expSelect = document.getElementById('filterExperience');
    const salaryInput = document.getElementById('filterSalary');
    const resetBtn = document.getElementById('resetFilters');
    const countLabel = document.getElementById('resultsCount');
    const keywordInput = document.getElementById('searchKeyword');
    const mainSearchForm = document.getElementById('mainSearchForm');
    const heroForm = document.getElementById('hero-search-form');

    const applyFilters = () => {
      const industry = industrySelect ? industrySelect.value : '';
      const exp = expSelect ? expSelect.value : '';
      const salary = salaryInput && salaryInput.value ? Number(salaryInput.value) : 0;
      const keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';

      let visibleCount = 0;

      items.forEach((item) => {
        const itemIndustry = item.getAttribute('data-industry') || '';
        const itemExp = item.getAttribute('data-experience') || '';
        const itemSalary = Number(item.getAttribute('data-salary') || 0);
        const text = item.innerText.toLowerCase();

        let match = true;

        if (industry && industry !== itemIndustry) match = false;
        if (exp && exp !== itemExp) match = false;
        if (salary && itemSalary < salary) match = false;
        if (keyword && !text.includes(keyword)) match = false;

        item.style.display = match ? '' : 'none';
        if (match) visibleCount += 1;
      });

      if (countLabel) {
        countLabel.textContent = `Найдено: ${visibleCount} вакансии`;
      }
    };

    industrySelect && industrySelect.addEventListener('change', applyFilters);
    expSelect && expSelect.addEventListener('change', applyFilters);
    salaryInput && salaryInput.addEventListener('input', applyFilters);
    keywordInput && keywordInput.addEventListener('input', applyFilters);

    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (industrySelect) industrySelect.value = '';
        if (expSelect) expSelect.value = '';
        if (salaryInput) salaryInput.value = '';
        if (keywordInput) keywordInput.value = '';
        applyFilters();
      });
    }

    if (mainSearchForm) {
      mainSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters();
      });
    }

    if (heroForm) {
      heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const heroKeyword = document.getElementById('heroKeyword');
        if (heroKeyword && keywordInput) {
          keywordInput.value = heroKeyword.value;
          applyFilters();
          const target = document.getElementById('search-block');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  }
  
  const candidateForms = document.querySelectorAll('form[data-role="candidate-login"]');
  candidateForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }
      window.location.href = 'user-dashboard.html';
    });
  });

  const employerForms = document.querySelectorAll('form[data-role="employer-login"]');
  employerForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }
      window.location.href = 'employer-dashboard.html';
    });
  });
});


