using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Bytewave.Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string SellerEmail { get; set; }
        public Customer Customer { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }

        public ICollection<OrderProduct> OrderProducts { get; set; }
    }

    public class OrderProduct
    {
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
    }
}
