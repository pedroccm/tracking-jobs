// DOM Elements
const loginForm = document.getElementById('loginForm');
const jobCapture = document.getElementById('jobCapture');
const userCodeInput = document.getElementById('userCode');
const saveCodeBtn = document.getElementById('saveCode');
const captureJobBtn = document.getElementById('captureJob');
const changeCodeBtn = document.getElementById('changeCode');
const statusDiv = document.getElementById('status');
const detectedJobDiv = document.getElementById('detectedJob');
const jobTitleDiv = document.getElementById('jobTitle');
const jobCompanyDiv = document.getElementById('jobCompany');

// Check if user code is saved
chrome.storage.local.get(['userCode'], function(result) {
  if (result.userCode) {
    showJobCapture();
    loadJobInfo();
  } else {
    showLoginForm();
  }
});

// Save user code
saveCodeBtn.addEventListener('click', function() {
  const code = userCodeInput.value.trim();
  if (!code) {
    showStatus('Por favor, insira um código válido', 'error');
    return;
  }

  chrome.storage.local.set({userCode: code}, function() {
    showStatus('Código salvo com sucesso!', 'success');
    setTimeout(() => {
      showJobCapture();
      loadJobInfo();
    }, 1000);
  });
});

// Change code
changeCodeBtn.addEventListener('click', function() {
  chrome.storage.local.remove(['userCode'], function() {
    showLoginForm();
  });
});

// Capture job
captureJobBtn.addEventListener('click', async function() {
  try {
    captureJobBtn.disabled = true;
    captureJobBtn.textContent = 'Capturando...';
    showStatus('Capturando informações da vaga...', 'info');

    // Get active tab
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    // Check if we're on LinkedIn job page
    if (!tab.url.includes('linkedin.com/jobs/view/')) {
      showStatus('Esta extensão funciona apenas em páginas de vagas do LinkedIn', 'error');
      captureJobBtn.disabled = false;
      captureJobBtn.textContent = 'Capturar Vaga';
      return;
    }

    // Execute content script to extract job info
    const results = await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: extractJobInfo
    });

    const jobData = results[0].result;
    if (!jobData) {
      showStatus('Não foi possível extrair as informações da vaga', 'error');
      captureJobBtn.disabled = false;
      captureJobBtn.textContent = 'Capturar Vaga';
      return;
    }

    // Get user code
    const storage = await chrome.storage.local.get(['userCode']);
    const userCode = storage.userCode;

    // Try production URL first, fallback to localhost
    const apiUrls = [
      'https://tracking-jobs-git-main-pedros-projects-74eb8b5d.vercel.app/api/jobs/capture',
      'http://localhost:3000/api/jobs/capture'
    ];

    let response;
    let lastError;
    
    for (const apiUrl of apiUrls) {
      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userCode,
            ...jobData
          })
        });

        if (response.ok) {
          showStatus('Vaga capturada e salva com sucesso!', 'success');
          break; // Success, exit the loop
        } else {
          const errorData = await response.json();
          lastError = `Erro ao salvar vaga: ${errorData.error || 'Erro desconhecido'}`;
          continue; // Try next URL
        }
      } catch (error) {
        lastError = error.message;
        continue; // Try next URL
      }
    }

    // If we get here and didn't succeed, show the last error
    if (!response || !response.ok) {
      showStatus(lastError || 'Erro ao capturar vaga. Verifique sua conexão.', 'error');
    }

  } catch (error) {
    console.error('Error capturing job:', error);
    showStatus('Erro ao capturar vaga. Verifique sua conexão com a internet.', 'error');
  }

  captureJobBtn.disabled = false;
  captureJobBtn.textContent = 'Capturar Vaga';
});

// Load job information from current page
async function loadJobInfo() {
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    if (!tab.url.includes('linkedin.com/jobs/view/')) {
      showStatus('Navegue até uma página de vaga do LinkedIn para usar esta extensão', 'info');
      return;
    }

    // Execute content script to get basic job info for preview
    const results = await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: getBasicJobInfo
    });

    const jobInfo = results[0].result;
    if (jobInfo) {
      jobTitleDiv.textContent = jobInfo.title || 'Título não encontrado';
      jobCompanyDiv.textContent = jobInfo.company || 'Empresa não encontrada';
      detectedJobDiv.style.display = 'block';
    }
  } catch (error) {
    console.error('Error loading job info:', error);
  }
}

// Content script functions (these run in the page context)
function extractJobInfo() {
  try {
    console.log('Extracting job info from LinkedIn...');
    const jobData = {};

    // Wait for content to load
    const waitForElement = (selector, timeout = 5000) => {
      return new Promise((resolve) => {
        const startTime = Date.now();
        const check = () => {
          const element = document.querySelector(selector);
          if (element) {
            resolve(element);
          } else if (Date.now() - startTime < timeout) {
            setTimeout(check, 100);
          } else {
            resolve(null);
          }
        };
        check();
      });
    };

    // Múltiplos seletores para título
    const titleSelectors = [
      'h1[data-test-id="job-title"]',
      'h1.top-card-layout__title',
      'h1.t-24.t-bold.jobs-unified-top-card__job-title',
      '.job-details-jobs-unified-top-card__job-title h1',
      '.jobs-unified-top-card__job-title',
      'h1.job-title',
      'h1[class*="job-title"]',
      'h1[class*="top-card"]'
    ];

    // Múltiplos seletores para empresa
    const companySelectors = [
      '[data-test-id="job-details-jobs-unified-top-card__company-name"] a',
      '.job-details-jobs-unified-top-card__company-name a',
      '.jobs-unified-top-card__company-name a',
      '.job-details-jobs-unified-top-card__primary-description-container a',
      'a[data-test-app-aware-link][href*="/company/"]',
      '.top-card-layout__card .top-card-layout__entity-info a'
    ];

    // Múltiplos seletores para localização
    const locationSelectors = [
      '.job-details-jobs-unified-top-card__bullet',
      '.jobs-unified-top-card__bullet',
      '.top-card-layout__second-subline',
      '.job-details-jobs-unified-top-card__primary-description-container .t-black--light'
    ];

    // Múltiplos seletores para descrição
    const descriptionSelectors = [
      '.job-details-jobs-unified-top-card__job-description',
      '.jobs-description__content',
      '.job-view-layout .jobs-description-content__text',
      '[data-test-id="job-details-description"]'
    ];

    // Função helper para tentar múltiplos seletores
    const getTextFromSelectors = (selectors) => {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
          return element.textContent.trim();
        }
      }
      return '';
    };

    // Extrair dados
    jobData.title = getTextFromSelectors(titleSelectors);
    jobData.company = getTextFromSelectors(companySelectors);
    jobData.location = getTextFromSelectors(locationSelectors);
    jobData.description = getTextFromSelectors(descriptionSelectors);

    // Job URL
    jobData.url = window.location.href;

    // Extract Job ID from URL
    const jobIdMatch = window.location.href.match(/jobs\/view\/(\d+)/);
    jobData.external_id = jobIdMatch ? jobIdMatch[1] : '';

    // Set default values
    jobData.status = 'applied';
    jobData.applied_date = new Date().toISOString().split('T')[0];

    console.log('Extracted job data:', jobData);
    return jobData;
  } catch (error) {
    console.error('Error extracting job info:', error);
    return null;
  }
}

function getBasicJobInfo() {
  try {
    // Usar os mesmos seletores múltiplos
    const titleSelectors = [
      'h1[data-test-id="job-title"]',
      'h1.top-card-layout__title',
      'h1.t-24.t-bold.jobs-unified-top-card__job-title',
      '.job-details-jobs-unified-top-card__job-title h1',
      '.jobs-unified-top-card__job-title',
      'h1.job-title',
      'h1[class*="job-title"]',
      'h1[class*="top-card"]'
    ];

    const companySelectors = [
      '[data-test-id="job-details-jobs-unified-top-card__company-name"] a',
      '.job-details-jobs-unified-top-card__company-name a',
      '.jobs-unified-top-card__company-name a',
      '.job-details-jobs-unified-top-card__primary-description-container a',
      'a[data-test-app-aware-link][href*="/company/"]',
      '.top-card-layout__card .top-card-layout__entity-info a'
    ];

    const getTextFromSelectors = (selectors) => {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
          return element.textContent.trim();
        }
      }
      return null;
    };

    return {
      title: getTextFromSelectors(titleSelectors),
      company: getTextFromSelectors(companySelectors)
    };
  } catch (error) {
    console.error('Error getting basic job info:', error);
    return null;
  }
}

// UI Helper functions
function showLoginForm() {
  loginForm.style.display = 'block';
  jobCapture.style.display = 'none';
  statusDiv.innerHTML = '';
}

function showJobCapture() {
  loginForm.style.display = 'none';
  jobCapture.style.display = 'block';
}

function showStatus(message, type) {
  statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
}