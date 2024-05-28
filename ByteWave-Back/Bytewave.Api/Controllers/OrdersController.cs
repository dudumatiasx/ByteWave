using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bytewave.Domain.Entities;
using Bytewave.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Bytewave.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var userRoles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

            IQueryable<Order> ordersQuery = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderProducts)
                .ThenInclude(op => op.Product);

            return await ordersQuery.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderProducts)
                .ThenInclude(op => op.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(Order order)
        {
            try
            {
                if (order == null || order.OrderProducts == null)
                {
                    return BadRequest("Invalid order data.");
                }

                var customer = await _context.Customers.FindAsync(order.CustomerId);
                if (customer == null)
                {
                    return BadRequest("Invalid customer ID.");
                }

                var productIds = order.OrderProducts.Select(op => op.ProductId).ToList();
                var products = await _context.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();

                if (products.Count != productIds.Count)
                {
                    return BadRequest("One or more products do not exist.");
                }

                order.TotalAmount = order.OrderProducts.Sum(op =>
                {
                    var product = products.FirstOrDefault(p => p.Id == op.ProductId);
                    if (product == null)
                    {
                        return 0;
                    }
                    return op.Quantity * product.Price;
                });

                foreach (var orderProduct in order.OrderProducts)
                {
                    var product = products.FirstOrDefault(p => p.Id == orderProduct.ProductId);
                    if (product != null)
                    {
                        product.Quantity -= orderProduct.Quantity;
                        if (product.Quantity < 0)
                        {
                            return BadRequest($"Product {product.Title} is out of stock.");
                        }
                    }
                }

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
        {
            if (id != order.Id)
            {
                return BadRequest("Order ID mismatch.");
            }

            var existingOrder = await _context.Orders
                .Include(o => o.OrderProducts)
                .ThenInclude(op => op.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (existingOrder == null)
            {
                return NotFound();
            }

            var productIds = order.OrderProducts.Select(op => op.ProductId).ToList();
            var products = await _context.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();

            if (products.Count != productIds.Count)
            {
                return BadRequest("One or more products do not exist.");
            }

            foreach (var existingOrderProduct in existingOrder.OrderProducts)
            {
                var product = products.FirstOrDefault(p => p.Id == existingOrderProduct.ProductId);
                if (product != null)
                {
                    product.Quantity += existingOrderProduct.Quantity;
                }
            }

            existingOrder.CustomerId = order.CustomerId;
            existingOrder.Status = order.Status;
            existingOrder.OrderDate = order.OrderDate;
            existingOrder.SellerEmail = existingOrder.SellerEmail;
            existingOrder.TotalAmount = order.TotalAmount;

            var existingOrderProductIds = existingOrder.OrderProducts.Select(op => op.ProductId).ToList();
            var newOrderProductIds = order.OrderProducts.Select(op => op.ProductId).ToList();

            var productsToRemove = existingOrder.OrderProducts.Where(op => !newOrderProductIds.Contains(op.ProductId)).ToList();
            foreach (var productToRemove in productsToRemove)
            {
                var product = products.FirstOrDefault(p => p.Id == productToRemove.ProductId);
                if (product != null)
                {
                    product.Quantity += productToRemove.Quantity;
                }
                existingOrder.OrderProducts.Remove(productToRemove);
            }

            // Update existing products and add new ones
            foreach (var newOrderProduct in order.OrderProducts)
            {
                var existingOrderProduct = existingOrder.OrderProducts.FirstOrDefault(op => op.ProductId == newOrderProduct.ProductId);
                var product = products.FirstOrDefault(p => p.Id == newOrderProduct.ProductId);
                if (existingOrderProduct != null)
                {
                    if (product != null)
                    {
                        product.Quantity += existingOrderProduct.Quantity;
                        existingOrderProduct.Quantity = newOrderProduct.Quantity;
                        product.Quantity -= newOrderProduct.Quantity;
                    }
                }
                else
                {
                    existingOrder.OrderProducts.Add(new OrderProduct
                    {
                        OrderId = existingOrder.Id,
                        ProductId = newOrderProduct.ProductId,
                        Quantity = newOrderProduct.Quantity
                    });
                    if (product != null)
                    {
                        product.Quantity -= newOrderProduct.Quantity;
                    }
                }

                if (product != null && product.Quantity < 0)
                {
                    return BadRequest($"Product {product.Title} is out of stock.");
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderProducts)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            foreach (var orderProduct in order.OrderProducts)
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == orderProduct.ProductId);
                if (product != null)
                {
                    product.Quantity += orderProduct.Quantity;
                }
            }

            _context.OrderProducts.RemoveRange(order.OrderProducts);
            _context.Orders.Remove(order);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
