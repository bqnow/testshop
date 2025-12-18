

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { productService } from '@/services/productService';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/routes';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  const query = typeof resolvedParams.query === 'string' ? resolvedParams.query : '';
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : '';

  const { data: products, totalPages, page: currentPage } = await productService.getAll({
    page,
    limit: 9,
    query,
    category
  });

  const categories = ['Electronics', 'Accessories', 'Office', 'Home'];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 1rem 0' }}>Welcome to TestShop</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} role="group" aria-label="Category filters">
            {!category ? (
              <span
                className="btn btn-primary"
                style={{ fontSize: '0.9rem', padding: '0.4rem 1rem', cursor: 'default' }}
                data-testid="category-all"
              >
                All
              </span>
            ) : (
              <Link
                href={ROUTES.HOME}
                className="btn btn-outline"
                style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}
                data-testid="category-all"
              >
                All
              </Link>
            )}
            {categories.map(cat => {
              const isActive = category.toLowerCase() === cat.toLowerCase();
              return isActive ? (
                <span
                  key={cat}
                  className="btn btn-primary"
                  style={{ fontSize: '0.9rem', padding: '0.4rem 1rem', cursor: 'default' }}
                  data-testid={`category-${cat.toLowerCase()}`}
                >
                  {cat}
                </span>
              ) : (
                <Link
                  key={cat}
                  href={ROUTES.CATEGORY(cat)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}
                  data-testid={`category-${cat.toLowerCase()}`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          <form style={{ display: 'flex', gap: '0.5rem' }} role="search" aria-label="Product search" action={ROUTES.HOME}>
            {category && <input type="hidden" name="category" value={category} />}
            <label htmlFor="search-input" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>Search products</label>
            <input
              id="search-input"
              type="text"
              name="query"
              defaultValue={query}
              placeholder="Search products..."
              className="input"
              style={{ width: '250px' }}
              data-testid="search-input"
            />
            <Button type="submit" data-testid="search-submit">Search</Button>
            {(query || category) && (
              <Link href={ROUTES.HOME} className="btn btn-outline" data-testid="clear-filters">Clear</Link>
            )}
          </form>
        </div>
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No products found.
        </div>
      ) : (
        <div className="grid-products">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }} role="navigation" aria-label="Pagination">
          {currentPage > 1 && (
            <Link
              href={ROUTES.PAGINATION(currentPage - 1, query)}
              className="btn btn-outline"
              data-testid="pagination-prev"
              aria-label="Previous page"
            >
              Previous
            </Link>
          )}

          <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: 600 }} data-testid="pagination-info">
            Page {currentPage} of {totalPages}
          </div>

          {currentPage < totalPages && (
            <Link
              href={ROUTES.PAGINATION(currentPage + 1, query)}
              className="btn btn-outline"
              data-testid="pagination-next"
              aria-label="Next page"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
