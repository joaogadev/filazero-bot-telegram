export function getAllowedTools(
  currentStep?: string
): string[] {

  switch (currentStep) {

    case "CHOOSING_COMPANY":
      return [
        "get_company_services"
      ];

    case "CHOOSING_SERVICE":
      return [
        "get_business_units"
      ];

    case "CHOOSING_LOCATION":
      return [
        "get_available_dates"
      ];

    case "CHOOSING_DATE":
      return [
        "get_available_sessions"
      ];

    default:
      return [
        "list_companies"
      ];
  }
}