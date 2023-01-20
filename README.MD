## CODESE - MESSAGE QUEUE

## HUGO REPO

## BTVN Số 2

### Khái niệm: offset

Các message được lưu trong partition cũng được order theo thứ tự từ cũ đến mới, append liên tục bắt đầu từ giá trị 0, được gọi là offset.

- Dù 2 message có cùng offset nhưng thuộc 2 partition khác nhau thì chúng cũng khác nhau. Offset chỉ có ý nghĩa trong cùng một partition.
- Offset có thứ tự, nhưng chỉ đảm bảo thứ tự trong cùng partition. Ví dụ trong cùng partition 1, message có offset = 3 chắc chắn đến sau message có offset = 2.
- Message sau khi được consume không bị xóa ngay, default giữ lại trong 7 ngày - có thể config. Sau 7 ngày message bị xóa nhưng offset không reset mà tiếp tục tăng.
- Data sau khi lưu vào partition là bất biến, không thể thay đổi. Không thể cập nhật, không thể swap sang offset khác.

### Khái niệm: commit

Mỗi tin nhắn mà Consumer gửi đến một partition Kafka đều có một offset — một index xác định từng message. Để theo dõi những message nào đã được xử lý, Consumer cần commit offset của những message đã được xử lý.

### Khái niệm: message key

Nếu muốn các message liên quan với nhau được gửi vào cùng partition và order theo thứ tự, cần define key cho mỗi message.

- Key có thể là bất kì loại dữ liệu nào: string, number...
- Nếu key = null, message được gửi đến broker/partition theo cơ chế round-robin.
- Nếu key != null, tất cả các message có cùng key sẽ đi vào cùng broker/partition.

Có thể coi key là mốc phân luồng của message. Nếu không có mốc này, message sẽ bị điều hướng đến bất kì đâu. Ngược lại, mốc này sẽ kiểm tra và tìm đúng luồng cho message.

### Khái niệm: partition

Topic được chia thành một hoặc nhiều partition và message được lưu trên đó. Khi tạo topic cần xác định số lượng partition mong muốn. Partition được order và bắt đầu từ 0.

Số lượng message của mỗi partition là độc lập, không phụ thuộc vào nhau. Như vậy, một message trong Kafka được xác định bởi 3 yếu tố:

- Topic name.
- Partition.
- Offset.

### Khái niệm: consumer group

Consumer là nơi đọc message từ topic. Có nghĩa là một consumer có thể đọc toàn bộ message của tất cả partition thuộc cùng topic.
Nếu số lượng producer tăng lên và đồng thời gửi message đến tất cả partition trong khi chỉ có duy nhất một consumer thì khả năng xử lý sẽ rất chậm, có thể dẫn tới bottle-neck. Giải pháp là tăng số lượng consumer, các consumer có thể xử lý đồng thời message từ nhiều partition. Và tất cả các consumer sẽ thuộc cùng một nhóm được gọi là consumer group.

Như vậy, consumer group đọc toàn bộ data của các partition và chia vào các consumer bên trong để xử lý.

Mỗi consumer thuộc consumer group sẽ đọc toàn bộ data của một hoặc nhiều partition để đảm bảo message ordering. Không tồn tại nhiều consumer cùng đọc message từ một partition.
