import js from "@eslint/js";
import globals from "globals";
import stylistic from '@stylistic/eslint-plugin';
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig, globalIgnores } from 'eslint/config'; // Corregido: Importación única

export default defineConfig([
  // 1. REGLAS PARA JAVASCRIPT (Backend Node.js)
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      js,
      '@stylistic': stylistic // Registramos el plugin estilístico
    },
    // Corregido: Usamos el objeto de configuración real en lugar de un string "extends"
    rules: {
      ...js.configs.recommended.rules,

      // REGLAS DEL CURSO (3.22)
      'eqeqeq': 'error',                                              // Exige usar === o !==
      'no-trailing-spaces': 'error',                                  // Prohíbe espacios al final de las líneas
      'no-console': 0,                                                // Permite el uso de console.log

      // REGLAS ESTILÍSTICAS (Manejadas por el plugin)
      '@stylistic/object-curly-spacing': ['error', 'always'],          // Exige espacios en objetos { name: ... }
      '@stylistic/arrow-spacing': ['error', { 'before': true, 'after': true }] // Espacios en funciones flecha
    },
    languageOptions: {
      globals: globals.node
    }
  },

  // 2. CONFIGURACIONES ADICIONALES DE FORMATOS
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.json"], plugins: { json }, language: "json/json", rules: json.configs.recommended.rules },
  { files: ["**/*.jsonc"], plugins: { json }, language: "json/jsonc", rules: json.configs.recommended.rules },
  { files: ["**/*.json5"], plugins: { json }, language: "json/json5", rules: json.configs.recommended.rules },
  { files: ["**/*.md"], plugins: { markdown }, language: "markdown/commonmark", rules: markdown.configs.recommended.rules },
  { files: ["**/*.css"], plugins: { css }, language: "css/css", rules: css.configs.recommended.rules },

  // 3. IGNORAR CARPETAS COMPILADAS
  globalIgnores(['dist/'])
]);
