const useFormReset = () => {
  
    const resetFields = (formData) => {
  
      for (const property in formData) {
          formData[property] = ''; 
      }
      console.log('Форма очищена:');
    };
  
    return { resetFields };
  };

export default useFormReset;