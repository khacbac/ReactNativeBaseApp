export default class UUID {
  private static byteToHex = UUID.init();

  private static init() {
    let byteToHex = [];
    for (var i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 0x100).toString(16).substr(1);
    }
    return byteToHex;
  }

  public static generate(options?, buf?, offset?) {
    var _nodeId;
    var _clockseq;

    // Previous uuid creation time
    var _lastMSecs = 0;
    var _lastNSecs = 0;

    var i = (buf && offset) || 0;
    var b = buf || [];

    options = options || {};
    var node = options.node || _nodeId;
    var clockseq =
      options.clockseq !== undefined ? options.clockseq : _clockseq;

    // node and clockseq need to be initialized to random values if they're not
    // specified.  We do this lazily to minimize issues related to insufficient
    // system entropy.  See #189
    if (node == null || clockseq == null) {
      var seedBytes = this.nodeRNG();
      if (node == null) {
        // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
        node = _nodeId = [
          seedBytes[0] | 0x01,
          seedBytes[1],
          seedBytes[2],
          seedBytes[3],
          seedBytes[4],
          seedBytes[5]
        ];
      }
      if (clockseq == null) {
        // Per 4.2.2, randomize (14 bit) clockseq
        clockseq = _clockseq = ((seedBytes[6] << 8) | seedBytes[7]) & 0x3fff;
      }
    }

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs =
      options.msecs !== undefined ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq === undefined) {
      clockseq = (clockseq + 1) & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = (tl >>> 24) & 0xff;
    b[i++] = (tl >>> 16) & 0xff;
    b[i++] = (tl >>> 8) & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = ((msecs / 0x100000000) * 10000) & 0xfffffff;
    b[i++] = (tmh >>> 8) & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = ((tmh >>> 24) & 0xf) | 0x10; // include version
    b[i++] = (tmh >>> 16) & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = (clockseq >>> 8) | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    for (var n = 0; n < 6; ++n) {
      b[i + n] = node[n];
    }

    return buf ? buf : this.bytesToUuid(b);
  }

  private static bytesToUuid(buf, offset?) {
    let i = offset || 0;
    let bth = this.byteToHex;
    return [
      bth[buf[i++]],
      bth[buf[i++]],
      bth[buf[i++]],
      bth[buf[i++]],
      "-",
      bth[buf[i++]],
      bth[buf[i++]],
      "-",
      bth[buf[i++]],
      bth[buf[i++]],
      "-",
      bth[buf[i++]],
      bth[buf[i++]],
      "-",
      bth[buf[i++]],
      bth[buf[i++]],
      bth[buf[i++]],
      bth[buf[i++]],
      bth[buf[i++]],
      bth[buf[i++]]
    ].join("");
  }

  private static nodeRNG() {
    // return crypto.randomBytes(16);
    return this.nextBytes(16);
  }

   /**
   * sinh ra số nguyên nhỏ hơn giá trị max
   * @param max: giá trị lớn nhất được truyền vào
   */
  private static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /**
   * lấy giá trị byte random
   * @param bytes
   */
  private static nextBytes(size: number): number[] {
    let ByteSIZE = 8;
    let bytes: number[] = new Array(size);
    // Log.e("nextBytes -------" + bytes);
    for (let i = 0, len = size; i < len; ) {
      for (
        let rnd = this.getRandomInt(32), n = Math.min(len - i, 4);
        n-- > 0;
        rnd >>= ByteSIZE
      ) {
        bytes[i++] = rnd;
      }
    }
    return bytes;
  }
}
