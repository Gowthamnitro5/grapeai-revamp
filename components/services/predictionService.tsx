// This is a mock prediction service. In a real application, you'd send the data to your backend API.
export const getPrediction = async (inputs: { solarRadiation: any; humidity: any; conductivity: any; phosphorous: any; pHValue: any; temperature: any; nitrogen: any; potassium: any; }) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const response = await fetch('http://10.0.2.2:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                solar_radiation: Number(inputs.solarRadiation),
                humidity: Number(inputs.humidity),
                conductivity: Number(inputs.conductivity),
                phosphorus: Number(inputs.phosphorous),
                ph_value: Number(inputs.pHValue),
                temperature: Number(inputs.temperature),
                nitrogen: Number(inputs.nitrogen),
                potassium: Number(inputs.potassium),
            }),
        });

        if (!response.ok) {
            console.log('Failed to get prediction');
            return null; // Return null if the response is not ok
        }

        const data = await response.json();
        return {
            disease: data['predicted_disease'],
            pestAttacks: {
                'Flea Beetle': data['predicted_pest_attacks']['Flea Beetle'],
                'Thrips': data['predicted_pest_attacks']['Thrips'],
                'MealyBug': data['predicted_pest_attacks']['Mealybug'],
                'Jassids': data['predicted_pest_attacks']['Jassids'],
                'Red Spider Mites': data['predicted_pest_attacks']['Red-Spider Mites'],
                'Leaf Eating Caterpillar': data['predicted_pest_attacks']['Leaf Eating Caterpillar'],
            },
        };
    } catch (err) {
        console.log(err);
        return null; // Return null in case of error
    }
};
