const fs = require('fs');
const path = 'd:/Antigravity/src/app/(customer)/[tenantSlug]/admin/settings/page.tsx';
let content = fs.readFileSync(path, 'utf-8');

const brokenRegex = /const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?if \(result\.success\) \{[\s\S]*?<Loader2 className="w-8 h-8 animate-spin text-primary" \/>/m;

const correctStr = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const payload = { ...formData, payments: enabledPayments };
      const result = await updateTenantSettings(tenant.id, payload);
      if (result.success) {
        toast.success("Action completed successfully!");
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfigChange = (method: string, field: string, value: string) => {
    setFormData({
      ...formData,
      paymentConfig: {
        ...formData.paymentConfig,
        [method]: {
          ...formData.paymentConfig[method],
          [field]: value
        }
      }
    });
  };

  const handleChatbotConfigChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      chatbotConfig: {
        ...formData.chatbotConfig,
        [field]: value
      }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />`;

content = content.replace(brokenRegex, correctStr);
fs.writeFileSync(path, content, 'utf-8');
console.log("Fixed!");
