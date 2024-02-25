async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return {"respuesta": 200, "mensaje": "Texto copiado con éxito."};
    } catch (error) {
        return {"respuesta": 500, "mensaje": "No se pudo copiar el texto."};
    }
  }

export default copyToClipboard