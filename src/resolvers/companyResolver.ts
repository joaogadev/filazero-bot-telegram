export function resolveCompany(
  companies: any[],
  value: any
) {

  if (!value) {
    return null;
  }

  const search =
    String(value)
      .toLowerCase()
      .trim()
      .replace(/-/g, " ");

  return companies.find((company) => {

    const name =
      company.name
        ?.toLowerCase()
        .trim();

    const slug =
      company.slug
        ?.toLowerCase()
        .trim();

    return (
      String(company.id) === String(value) ||
      name === search ||
      slug === search ||
      name?.includes(search)
    );
  });
}