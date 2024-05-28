using System.Collections.Generic;

namespace Bytewave.Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; }
        public string Category { get; set; }
        public string ImageUrl { get; set; }

        public ICollection<OrderProduct> OrderProducts { get; set; }
    }
}