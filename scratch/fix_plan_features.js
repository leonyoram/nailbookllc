const fs = require('fs');

let content = fs.readFileSync('src/app/(super-admin)/super-admin/page.tsx', 'utf8');

const targetStr = `onChange={(e) => {
                                const plan = e.target.value;
                                const staffInput = document.querySelector('input[name="staffLimit"]') as HTMLInputElement;
                                const smsLimitSelect = document.querySelector('select[name="smsLimit"]') as HTMLSelectElement;
                                const smsEnabledCheckbox = document.querySelector('input[name="smsEnabled"]') as HTMLInputElement;
                                
                                if (plan === 'Trial') {
                                  if (staffInput) staffInput.value = '1';
                                  if (smsEnabledCheckbox && smsEnabledCheckbox.checked) smsEnabledCheckbox.click();
                                } else if (plan === 'Basic') {
                                  if (staffInput) staffInput.value = '3';
                                  if (smsLimitSelect) smsLimitSelect.value = '100';
                                  if (smsEnabledCheckbox && !smsEnabledCheckbox.checked) smsEnabledCheckbox.click();
                                } else if (plan === 'Advanced') {
                                  if (staffInput) staffInput.value = '10';
                                  if (smsLimitSelect) smsLimitSelect.value = '500';
                                  if (smsEnabledCheckbox && !smsEnabledCheckbox.checked) smsEnabledCheckbox.click();
                                } else if (plan === 'Unlimited') {
                                  if (staffInput) staffInput.value = '9999';
                                  if (smsLimitSelect) smsLimitSelect.value = '5000';
                                  if (smsEnabledCheckbox && !smsEnabledCheckbox.checked) smsEnabledCheckbox.click();
                                }
                              }}`;

const replaceStr = `onChange={(e) => {
                                const plan = e.target.value;
                                const staffInput = document.querySelector('input[name="staffLimit"]') as HTMLInputElement;
                                const smsLimitSelect = document.querySelector('select[name="smsLimit"]') as HTMLSelectElement;
                                const smsEnabledCheckbox = document.querySelector('input[name="smsEnabled"]') as HTMLInputElement;
                                
                                const features = {
                                  Trial: ["staff", "workingHours", "staffTimeOff", "attendance", "reports"],
                                  Basic: ["staff", "workingHours", "staffTimeOff", "attendance", "reports", "social", "payments", "promotions"],
                                  Advanced: ["staff", "workingHours", "staffTimeOff", "attendance", "reports", "social", "payments", "promotions", "sms", "googleReviews"],
                                  Unlimited: ["promotions", "staff", "attendance", "sms", "chatbot", "reports", "googleReviews", "social", "payments", "workingHours", "staffTimeOff"]
                                };
                                const toEnable = features[plan as keyof typeof features] || features.Trial;
                                const allFeatures = ["promotions", "staff", "attendance", "sms", "chatbot", "reports", "googleReviews", "social", "payments", "workingHours", "staffTimeOff"];
                                
                                allFeatures.forEach(feat => {
                                  const cb = document.querySelector(\`input[name="feature_\${feat}"]\`) as HTMLInputElement;
                                  if (cb) cb.checked = toEnable.includes(feat);
                                });

                                if (plan === 'Trial') {
                                  if (staffInput) staffInput.value = '1';
                                  if (smsEnabledCheckbox && smsEnabledCheckbox.checked) smsEnabledCheckbox.click();
                                } else if (plan === 'Basic') {
                                  if (staffInput) staffInput.value = '3';
                                  if (smsLimitSelect) smsLimitSelect.value = '100';
                                  if (smsEnabledCheckbox && !smsEnabledCheckbox.checked) smsEnabledCheckbox.click();
                                } else if (plan === 'Advanced') {
                                  if (staffInput) staffInput.value = '10';
                                  if (smsLimitSelect) smsLimitSelect.value = '500';
                                  if (smsEnabledCheckbox && !smsEnabledCheckbox.checked) smsEnabledCheckbox.click();
                                } else if (plan === 'Unlimited') {
                                  if (staffInput) staffInput.value = '9999';
                                  if (smsLimitSelect) smsLimitSelect.value = '5000';
                                  if (smsEnabledCheckbox && !smsEnabledCheckbox.checked) smsEnabledCheckbox.click();
                                }
                              }}`;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('src/app/(super-admin)/super-admin/page.tsx', content);
console.log("Done");
